import jwt = require('jsonwebtoken');
import express = require('express');

const accessTokenSecret = process.env.TOKEN_SECRET!;

export const authenticateJWT = (req: express.Request, res: express.Response, next: () => void) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, token) => {
            if (err) {
                return res.sendStatus(403);
            }

            if (token) {
                req.user = token as jwt.JwtPayload;
                next();
            }

        });
    } else {
        res.sendStatus(401);
    }
};
