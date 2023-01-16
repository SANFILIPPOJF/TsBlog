import * as bcrypt from 'bcrypt';
import express = require('express');
import { UsersService } from '../services/users_services';

const usersService = new UsersService();

export class UsersController {
    async register(req: express.Request, res: express.Response) {
        const name: string = req.body.name;
        const pass: string = req.body.password;

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
                        data: data
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
    }


    login() {

    }
}