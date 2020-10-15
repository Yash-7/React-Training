const initialState = {
  all: [],
  assigned: [],
  todo: [],
};

const TaskReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case "DELETETASK":
      return {
        ...state,
        assigned: [
          ...state.assigned.filter((task) => task.id !== actions.payload),
        ],
        all: [...state.all.filter((task) => task.id !== actions.payload)],
      };
    case "EDITTASK":
      const { task } = actions.payload;
      return {
        ...state,
        assigned: [
          ...state.assigned.map((assigned) => {
            if (assigned.id === actions.payload.id) {
              return {
                ...assigned,
                dueDate: task.dueDate,
                title: task.title,
                description: task.description,
              };
            }
            return assigned;
          }),
        ],
        all: [
          ...state.all.map((assigned) => {
            if (assigned.id === actions.payload.id) {
              return {
                ...assigned,
                dueDate: task.dueDate,
                title: task.title,
                description: task.description,
              };
            }
            return assigned;
          }),
        ],
      };
    case "UPDATESTATUS":
      const { id, status } = actions.payload;
      return {
        ...state,
        todo: [
          ...state.todo.map((task) => {
            if (task.id === id) {
              return { ...task, status: status };
            }
            return task;
          }),
        ],
        all: [
          ...state.all.map((task) => {
            if (task.id === id) {
              return { ...task, status: status };
            }
            return task;
          }),
        ],
      };
    case "GETTASKS":
      switch (actions.payload.case) {
        case "ALL":
          return {
            ...state,
            all: [...actions.payload.tasks],
          };
        case "ASSIGNED":
          return {
            ...state,
            assigned: [...actions.payload.tasks],
          };
        case "TODO":
          return {
            ...state,
            todo: [...actions.payload.tasks],
          };
        default:
          return state;
      }
    case "ADDTASK":
      switch (actions.payload.case) {
        case "ALL":
          return {
            ...state,
            all: [...state.all, actions.payload.task],
          };
        case "ASSIGNED":
          return {
            ...state,
            assigned: [...state.assigned, actions.payload.task],
          };
        default:
          return state;
      }
    default:
      return state;
  }
};

export default TaskReducer;
