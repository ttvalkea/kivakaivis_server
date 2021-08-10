const users = [];

// joins the user to the specific chatroom
function joinUser(id, userName, room) {
  const user = { id, userName, room };

  users.push(user);
  console.log(users, "users");

  return user;
}

console.log("user out", users);

// Gets a particular user id to return the current user
function getCurrentUser(id) {
  return users.find((u) => u.id === id);
}

// called when the user leaves the chat and its user object deleted from array
function userDisconnect(id) {
  const index = users.findIndex((u) => u.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

module.exports = {
  joinUser,
  getCurrentUser,
  userDisconnect,
};
