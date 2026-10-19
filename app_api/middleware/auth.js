const jwt = require('jsonwebtoken');


function authenticateJWT(req, res, next) {
    const authorization = req.headers.authorization;

    if (typeof authorization !== 'string') {
        return res.sendStatus(401);
    }

    const parts = authorization.trim().split(/\s+/);

    if (parts.length !== 2 ||
        parts[0].toLowerCase() !== 'bearer' ||
        !parts[1]) {
        return res.sendStatus(401);
    }

    if (!process.env.JWT_SECRET) {
        return res.sendStatus(500);
    }

    try {

        req.auth = jwt.verify(parts[1], process.env.JWT_SECRET);

        return next();
    }
    catch (err) {
        return res.sendStatus(401);
    }
}


module.exports = authenticateJWT;
