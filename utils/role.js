const { StatusCodes } = require('http-status-codes');

const roles = {
  admin: ['getAllUsers', 'getUsersToAccept'],
  users: [],
};

const roleRights = new Map(Object.entries(roles));
/* exports.hasPermission = (permission) => {
  return function (req, res, next) {
    const userRole = req.user.role;
    const userRights = roleRights.get('admin')
    if (roles[userRole]?.includes(permission)) next();
    else {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Access denied : you are not granted permission.',
      });
    }
  };
};
*/
module.exports = roleRights;

