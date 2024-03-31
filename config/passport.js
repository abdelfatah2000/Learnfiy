const fs = require('fs');
const path = require('path');
const User = require('../models/users.model');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const pathToKey = path.join(__dirname, '..', 'public.key');
const Public_Key = fs.readFileSync(pathToKey, 'utf8');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: Public_Key,
  algorithms: ['RS256'],
};

exports.jwtStrategy = new JwtStrategy(options, (payload, done) => {
  User.findById(payload.userID)
    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err, null));
});
