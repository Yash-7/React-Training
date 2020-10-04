const initialState = {
  isLogged: false,
  loggedUser: {},
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        isLogged: true,
        loggedUser: { ...action.payload },
      };
    }
    case "LOGOUT": {
      return {
        isLogged: false,
        loggedUser: {},
      };
    }
    default: {
      return state;
    }
  }
};

export default authReducer;
