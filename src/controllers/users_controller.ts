import * as bcrypt from 'bcrypt';
import express = require('express');
import { UsersService } from '../services/users_services';
import jwt = require('jsonwebtoken');
import { TApiResponse } from '../types/types';
import { EStatus } from '../constant/const';

const usersService = new UsersService();
const accessTokenSecret = process.env.TOKEN_SECRET!;

export class UsersController {
    async register(req: express.Request, res: express.Response) {
        const name: string = req.body.name;
        const password: string = req.body.password;
        if (!name) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Username can't be empty"
            }
            res.status(404).json(response)
        }
        if (!password) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Password can't be empty"
            }
            res.status(404).json(response)
        }
        try {
            const userExist = await usersService.getUserByName(name);
            if (userExist) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "Username allready exist"
                }
                res.status(400).json(response)
                return;
            }
            bcrypt.hash(password, 10, async function (err, hash) {
                try {
                    const data = await usersService.addUser(name, hash);
                    const response: TApiResponse = {
                        status: EStatus.OK,
                        data: data.name,
                        message: "User registered"
                    }
                    res.status(201).json(response)
                } catch (err) {
                    const response: TApiResponse = {
                        status: EStatus.FAIL,
                        data: null,
                        message: "Server error"
                    }
                    res.status(500).json(response)
                }
            });
        } catch (error) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Server Error"
            }
            res.status(500).json(response)
        }

    }

    async login(req: express.Request, res: express.Response) {
        const password = req.body.password;
        const name = req.body.name;
        if (!name) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Username can't be empty"
            }
            res.status(404).json(response)
        }
        if (!password) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Password can't be empty"
            }
            res.status(404).json(response)
        }
        try {
            const userExist = await usersService.getUserByName(name);
            if (!userExist) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "User unknown"
                }
                res.status(404).json(response)
                return;
            }
            bcrypt.compare(password, userExist.password, function (err, result) {
                if (result) {
                    const accessToken = jwt.sign({ userId: userExist.id }, accessTokenSecret);
                    const response: TApiResponse = {
                        status: EStatus.OK,
                        data: accessToken,
                        message: "Logged in"
                    }
                    res.status(202).json(response)
                    return;
                }
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "Uncorrect password"
                }
                res.status(401).json(response)
            })

        } catch (error) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Server error"
            }
            res.status(500).json(response)
        }
    }
}