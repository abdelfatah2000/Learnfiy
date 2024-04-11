const fs = require('fs');
const path = require('path');
const User = require('../models/users.model');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const pathToKey = path.join(__dirname, '..', 'public.key');
const Public_Key = fs.readFileSync(pathToKey, 'utf8');

const options = {
  secretOrKey: Public_Key,
  algorithms: ['RS256'],
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtStrategy = new JwtStrategy(options, (payload, done) => {
  console.log('Verifying JWT payload...');
  User.findById(payload.id)
    .then((user) => {
      if (user) {
        return done(null, { id: user._id, role: user.role });
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err, null));
});

module.exports = (passport) => {
  passport.use(jwtStrategy);
};
