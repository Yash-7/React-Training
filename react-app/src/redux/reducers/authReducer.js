const initialState = {
  isLogged: localStorage.getItem("token") ? true : false,
  loggedUser: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {},
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
      localStorage.clear();
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
