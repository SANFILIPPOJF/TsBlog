import express = require('express');
import { ArticlesController } from '../controllers/articles_controller';

export const articlesRouter = express.Router();

const usersController = new ArticlesController();

articlesRouter.post('/add', usersController.add)
articlesRouter.post('/modify', usersController.modify)
articlesRouter.post('/delete', usersController.delete)