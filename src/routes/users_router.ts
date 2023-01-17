import express = require('express');
import { UsersController } from '../controllers/users_controller';

export const usersRouter = express.Router();

const usersController = new UsersController();

usersRouter.post('/register', usersController.register)
usersRouter.get('/login', usersController.login)
