<?php

namespace App\Http\Controllers;
// require __DIR__.'../../vendor.autoload.php';
use App\Events\NotificationEvent;
use DateTime;
use Carbon\Carbon;
use App\User;
use App\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\newTask;
use Pusher;
use App\Jobs\NewTaskJob;
use App\NotificationData;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    public function data()
    {
        $id = Auth::id();
        $mytime = Carbon::now('Asia/Kolkata');
        // return $mytime->toTimeString();
        $todoData = [
            'todo' => Task::where('assignee', $id)->where('status', 'assigned')->count(),
            'inProgress' => Task::where('assignee', $id)->where('status', 'in-progress')->count(),
            'completed' => Task::where('assignee', $id)->where('status', 'completed')->count(),
            'overdue' => Task::where('assignee', $id)->where('dueDate', '<', $mytime)->where('status', '!=', 'completed')->count(),
        ];
        $assignedData = [
            'assigned' => User::find($id)->tasks()->where('status', 'assigned')->count(),
            'inProgress' => User::find($id)->tasks()->where('status', 'in-progress')->count(),
            'completed' => User::find($id)->tasks()->where('status', 'completed')->count(),
            'overdue' => User::find($id)->tasks()->where('dueDate', '<', $mytime)->where('status', '!=', 'completed')->count(),
        ];
        if (Auth::user()->role == "admin") {
            $allData = [
                'assigned' => Task::where('status', 'assigned')->count(),
                'inProgress' => Task::where('status', 'in-progress')->count(),
                'completed' => Task::where('status', 'completed')->count(),
                'overdue' => Task::where('dueDate', '<', $mytime)->where('status', '!=', 'completed')->count(),
            ];
            return response()->json(['myTasks' => $todoData, 'assignedTasks' => $assignedData, 'allTasks' => $allData]);
        }
        return response()->json(['myTasks' => $todoData, 'assignedTasks' => $assignedData]);
    }
    public function getAllTasks()
    {
        if (Auth::user()->role == "admin") {
            $tasks = Task::orderBy('dueDate')->get();
            return response()->json(['tasks' => $tasks], 200);
        } else return response()->json(['message' => 'not authorised'], 401);
    }
    public function getAssignedTasks()
    {
        $userId = Auth::id();
        $tasks = User::find($userId)->tasks()->orderBy('dueDate')->get();
        return response()->json(['tasks' => $tasks], 200);
    }
    public function getTodoTasks()
    {
        $userId = Auth::id();
        $tasks = Task::where('assignee', '=', $userId)->orderBy('dueDate')->get();
        return response()->json(['tasks' => $tasks], 200);
    }
    public function createTask(Request $request)
    {
        $userId = Auth::id();
        $creator = User::find($userId);
        // return Carbon::parse($request->get('date'))->timestamp;
        $this->validate($request, [
            'title' => 'required',
            'description' => 'required',
            'assignee' => 'required',
            'dueDate' => 'required',
        ]);
        $task = new Task;
        $task->title = $request->input('title');
        $task->description = $request->input('description');
        $task->assignee = $request->input('assignee');
        $date = new DateTime($request->get('dueDate'));
        $task->dueDate = $date->format('Y-m-d H:i:s');
        $task->status = 'assigned';

        $creator->tasks()->save($task);

        $data = new NotificationData;
        $data->message = 'New task: ' . $task->title . ' has been assigned to you';
        $data->id = $task->assignee;
        $data->channel = 'channel';
        $data->event = 'createTask';
        event(new NotificationEvent($data));

        $this->dispatch(new NewTaskJob(User::find($request->input('assignee'))->email, $task));
        return response()->json(['message' => 'Task created', 'task' => $task], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $this->validate($request, [
            'status' => 'required'
        ]);
        $task = Task::find($id);
        if (Auth::id() != $task->assignee) return response()->json(['message' => 'User unauthorised'], 401);
        $task->status = $request->input('status');
        $task->save();

        $data = new NotificationData;
        $data->message = 'Status of the task: ' . $task->title . ' Changed to ' . $request->input('status');
        $data->id = $task->user_id;
        $data->channel = 'my-channel';
        $data->event = 'statusUpdate';
        event(new NotificationEvent($data));

        return response()->json(['message' => 'Status updated'], 200);
    }

    public function updateTask(Request $request, $id)
    {
        $this->validate($request, [
            'title' => 'required',
            'description' => 'required',
            'dueDate' => 'required',
        ]);
        $task = Task::find($id);
        if (Auth::id() != $task->user_id) return response()->json(['message' => 'User unauthorised'], 401);
        $task->title = $request->input('title');
        $task->description = $request->input('description');
        $date = new DateTime($request->get('dueDate'));
        $task->dueDate = $date->format('Y-m-d H:i:s');
        $task->save();
        return response()->json(['message' => 'Task updated'], 200);
    }
    public function deleteTask($id)
    {
        $task = Task::find($id);
        $creator = $task->user_id;
        if (Auth::id() != $creator) return response()->json(['message' => 'not authorised to delete'], 403);
        $task->status = "deleted";
        $task->save();
        $task->delete();
        return response()->json(['message' => 'task deleted'], 200);
    }
    public function filter(Request $request, $type, $id)
    {
        if ($type == "todo") {
            $tasks = Task::where('assignee', '=', $id);
        } else if ($type == "assigned") {
            $tasks = User::find($id)->tasks()->orderBy('dueDate');
        } else if ($type == "all" && Auth::user()->role == "admin") {
            $tasks = Task::orderBy('dueDate');
        }
        if ($request->has('keyword')) {
            $tasks->where(function ($q) use ($request) {
                $q->where('title', 'LIKE', '%' . $request->get('keyword') . '%')
                    ->orWhere('description', 'LIKE', '%' . $request->get('keyword') . '%');
            });
        }
        if ($request->has('assignor')) {
            $tasks->where('user_id', '=', $request->input('assignor'));
        }
        if ($request->has('assignee')) {
            $tasks->where('assignee', '=', $request->input('assignee'));
        }
        if ($request->has('startTime')) {
            $start = new DateTime($request->get('startTime'));
            $start = $start->format('Y-m-d H:i:s');
            $tasks->where('dueDate', '>', $start);
        }
        if ($request->has('endTime')) {
            $end = new DateTime($request->get('endTime'));
            $end = $end->format('Y-m-d H:i:s');
            $tasks->where('dueDate', '<', $end);
        }
        return $tasks->get();
    }
}
