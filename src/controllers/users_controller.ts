import * as bcrypt from 'bcrypt';
import express = require('express');
import { UsersService } from '../services/users_services';
import jwt = require('jsonwebtoken');

const usersService = new UsersService();
const accessTokenSecret = process.env.TOKEN_SECRET!;
export class UsersController {
    async register(req: express.Request, res: express.Response) {
        const name: string = req.body.name;
        const pass: string = req.body.password;

        try {
            const userExist = await usersService.getUserByName(name);
            if (userExist) {
                res.status(406).json(
                    {
                        status: "not acceptable",
                        message: "Username allready exist",
                    }
                )
                return;
            }
            bcrypt.hash(pass, 10, async function (err, hash) {
                try {
                    const data = await usersService.addUser(name, hash);

                    res.status(201).json(
                        {
                            status: "success",
                            message: "User registered",
                            username: data.name
                        }
                    )
                } catch (err) {
                    res.status(500).json(
                        {
                            status: "fail",
                            message: "erreur serveur"
                        }
                    )
                }
            });
        } catch (error) {
            res.status(500).json({ status: "fail", message: "Erreur serveur" })
        }

    }

    async login(req: express.Request, res: express.Response) {
        const password = req.body.password;
        const name = req.body.name;
        try {
            const userExist = await usersService.getUserByName(name);
            if (!userExist) {
                res.status(404).json(
                    {
                        status: "fail",
                        message: "Username unknown",
                    }
                )
                return;
            }
            bcrypt.compare(password, userExist.password, function (err, result) {
                if (result) {
                    const accessToken = jwt.sign({ userId: userExist.id }, accessTokenSecret);
                    res.status(202).json({
                        status: "OK",
                        data: accessToken,
                        message: 'logged in'
                    })
                    return;
                }
                res.status(401).json({
                    status: "fail",
                    message: "uncorrect password"
                })
            })

        } catch (error) {
            res.status(500).json({ status: "fail", data: "Erreur serveur" })
        }
    }
}