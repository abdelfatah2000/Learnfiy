const passport = require('passport');
const { StatusCodes } = require('http-status-codes');
const roleRights = require('../utils/role');
const HttpException = require('../utils/HttpException');

const verifyCallback =
  (req, resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new HttpException(StatusCodes.UNAUTHORIZED, 'Please Authenticate')
      );
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights?.includes(requiredRight)
      );
      if (!hasRequiredRights) {
        return reject(new HttpException(StatusCodes.FORBIDDEN, 'Forbidden Access'));
      }
    }

    resolve();
  };

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
