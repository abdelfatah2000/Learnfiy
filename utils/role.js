const roles = {
  admin: [
    'getAllUsers',
    'getUsersToAccept',
    'postAcceptNewUsers',

  ],
  users: [],
};

const roleRights = new Map(Object.entries(roles));
module.exports = roleRights;
