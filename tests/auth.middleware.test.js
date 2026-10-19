const jwt = require('jsonwebtoken');
const test = require('node:test');
const assert = require('node:assert/strict');

const authenticateJWT = require('../app_api/middleware/auth');

test('Rejects requests without an authorization header', () => {
    const req = {
        headers: {}

    };

    let statusCode = null;
    let nextCalled = false;

    const res = {
        sendStatus(code) {
            statusCode = code;
            return this;
        }
    };

    const next = () => {
        nextCalled = true;
    }

    authenticateJWT(req, res, next);

    assert.equal(statusCode, 401);
    assert.equal(nextCalled, false);
});

test('Rejects a JWT signed with the wrong secret', () => {
    const originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'capstone-test-secret';

    try {
        //creates token with wrong secret
        const token = jwt.sign(
            { username: 'testuser' },
            'incorrect-secret'
        );

        const req = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };

        let statusCode = null;
        let nextCalled = false;

        const res = {
            sendStatus(code) {
                statusCode = code;
                return this;
            }
        };

        const next = () => {
            nextCalled = true;
        };

        authenticateJWT(req, res, next);

        assert.equal(statusCode, 401)
        assert.equal(nextCalled, false);
    }
    finally {
        if (originalSecret === undefined) {
            delete process.env.JWT_SECRET;
        }
        else {
            process.env.JWT_SECRET = originalSecret;
        }
    }
});

test('Rejects an expired JWT', () => {
    const originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'capstone-test-secret';

    try {
        //creates expired token
        const token = jwt.sign(
            { username: 'testuser' },
            process.env.JWT_SECRET,
            { expiresIn: '-1s' }
        );

        const req = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };
        let statusCode = null;
        let nextCalled = false;

        const res = {
            sendStatus(code) {
                statusCode = code;
                return this;
            }
        };

        const next = () => {
            nextCalled = true;
        };
        authenticateJWT(req, res, next);

        assert.equal(statusCode, 401);
        assert.equal(nextCalled, false);
    }

    finally {
        if (originalSecret === undefined) {
            delete process.env.JWT_SECRET;
        }
        else {
            process.env.JWT_SECRET = originalSecret;
        }
    }
});

test('Accepts a valid token', () => {
    const originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'capstone-test-secret';

    try {
        //creates a token with a one-hour lifespan
        const token = jwt.sign(
            { username: 'testuser' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const req = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };
        let statusCode = null;
        let nextCalled = false;

        const res = {
            sendStatus(code) {
                statusCode = code;
                return this;
            }
        };

        const next = () => {
            nextCalled = true;
        };

        authenticateJWT(req, res, next);

        assert.equal(statusCode, null);
        assert.equal(nextCalled, true);
        assert.equal(req.auth.username, 'testuser');
    }

    finally {
        if (originalSecret === undefined) {
            delete process.env.JWT_SECRET;
        }
        else {
            process.env.JWT_SECRET = originalSecret;
        }
    }
});