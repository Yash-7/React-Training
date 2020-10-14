<?php

namespace App\Http\Controllers;

use DateTime;
use App\User;
use App\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function __construct(){
        $this->middleware('auth');
    }
    public function getAllTasks(){
        if(Auth::user()->role == "admin"){
            $tasks = Task::orderBy('dueDate')->get();
            return response()->json(['tasks'=>$tasks],200);
        } else return response()->json(['message'=>'not authorised'],401);
    }
    public function getAssignedTasks(){
        $userId = Auth::id();
        $tasks = User::find($userId)->tasks()->orderBy('dueDate')->get();
        return response()->json(['tasks'=>$tasks],200);
    }
    public function getTodoTasks(){
        $userId = Auth::id();
        $tasks = Task::where('assignee','=',$userId)->orderBy('dueDate')->get();
        return response()->json(['tasks'=>$tasks],200);
    }
    public function createTask(Request $request){
        $userId = Auth::id();
        $creator = User::find($userId);
        // return Carbon::parse($request->get('date'))->timestamp;
        $this->validate($request,[
            'title'=>'required',
            'description'=>'required',
            'assignee'=>'required',
            'dueDate'=>'required',
        ]);
        $task = new Task;
        $task->title = $request->input('title');
        $task->description = $request->input('description');
        $task->assignee = $request->input('assignee');
        $date = new DateTime($request->get('dueDate'));
        $task->dueDate=$date->format('Y-m-d H:i:s');
        $task->status = 'assigned';

        $creator->tasks()->save($task);
        // Send mail
        return response()->json(['message'=>'Task created','task'=>$task],201);
    }

    public function updateStatus(Request $request,$id){
        $this->validate($request,[
            'status'=>'required'
        ]);
        $task = Task::find($id);
        if(Auth::id()!=$task->assignee) return response()->json(['message'=>'User unauthorised'],401);
        $task->status = $request->input('status');
        $task->save();
        return response()->json(['message'=>'Status updated'],200);
    }

    public function updateTask(Request $request,$id){
        $this->validate($request,[
            'title'=>'required',
            'description'=>'required',
            'dueDate'=>'required',
        ]);
        $task = Task::find($id);
        if(Auth::id()!=$task->user_id) return response()->json(['message'=>'User unauthorised'],401);
        $task->title = $request->input('title');
        $task->description = $request->input('description');
        $date = new DateTime($request->get('dueDate'));
        $task->dueDate=$date->format('Y-m-d H:i:s');
        $task->save();
        return response()->json(['message'=>'Task updated'],200);
    }
    public function deleteTask($id){
        $task = Task::find($id);
        $creator = $task->user_id;
        if(Auth::id()!= $creator) return response()->json(['message'=>'not authorised to delete'],403);

        $task->delete();
        return response()->json(['message'=>'task deleted'],200);
    }
    public function filter(Request $request,$type,$id){
        if($type=="todo"){
            $tasks = Task::where('assignee','=',$userId)->get();
        }
        if($type=="assigned"){
            $tasks = User::find($userId)->tasks;
        }
        if($type=="all" && Auth::user()->role == "admin"){
            $tasks=Task::orderBy('dueDate')->get();
        }
        return Auth::id();
    }
}
