var jwt = require("jsonwebtoken");

const PRIVATE_KEY =process.env.JWT_KEY

module.exports = {
  tokenGenerator: userData => {
    //console.log(userData);
    var jwt_token = jwt.sign(
      {
        id: userData[0],
        username: userData[1]
      },
      PRIVATE_KEY,
      {
        expiresIn: "24h"
      }
    );
    return jwt_token;
  },

  parseAuthorization: authorization => {
    return authorization != null ? authorization.replace("Bearer ", "") : null;
  },

  getUserId: authorization => {
    var userId = -1;
    var token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      try {
        var jwtToken = jwt.verify(token, PRIVATE_KEY);
        if (jwtToken != null) userId = jwtToken.id;
      } catch (err) {}
    }
    return userId;
  },

  verifyToken: token => {
    if (token != null) {
        var jwtToken = jwt.verify(token, PRIVATE_KEY);
        //console.log(jwtToken);
        if (jwtToken != null) return (jwtToken);
        else return (null);
    }
  }
};
