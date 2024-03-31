const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const pathToKey = path.join(__dirname, '..', 'private.key');
const Private_Key = fs.readFileSync(pathToKey, 'utf8');

const jwtToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };

  const token = jwt.sign(payload, Private_Key, {algorithm: 'RS256'});
  return token;
};

module.exports = jwtToken