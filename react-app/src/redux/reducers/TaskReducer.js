const initialState = {
  all: [],
  assigned: [],
  todo: [],
};

const TaskReducer = (state = initialState, actions) => {
  switch (actions.type) {
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
