import jwt = require('jsonwebtoken');
import express = require('express');
import { TApiResponse } from '../types/types';
import { EStatus } from '../constant/const';

const accessTokenSecret = process.env.TOKEN_SECRET!;

export const authenticateJWT = (req: express.Request, res: express.Response, next: () => void) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, token) => {
            if (err) {
                const response: TApiResponse = {
                    status: EStatus.OK,
                    data: null,
                    message: "User must be logged in"
                }
                res.status(403).json(response)
                return;
            }

            if (token) {
                req.user = token as jwt.JwtPayload;
                next();
            }

        });
    } else {
        const response: TApiResponse = {
            status: EStatus.FAIL,
            data: null,
            message: "Athentication error"
        }
        res.status(401).json(response)
    }
};
