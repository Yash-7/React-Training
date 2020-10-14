export const login = (user) => {
  return {
    type: "LOGIN",
    payload: user,
  };
};
export const logout = () => {
  return {
    type: "LOGOUT",
  };
};
export const getUsers = (users) => {
  return {
    type: "GETUSERS",
    payload: users,
  };
};
export const createUser = (user) => {
  return {
    type: "CREATEUSER",
    payload: user,
  };
};
export const deleteUser = (id) => {
  return {
    type: "DELETEUSER",
    payload: id,
  };
};
export const getTasks = (tasks) => {
  return {
    type: "GETTASKS",
    payload: tasks,
  };
};
export const addTask = (task) => {
  return {
    type: "ADDTASK",
    payload: task,
  };
};
