import express = require('express');
import { ArticlesController } from '../controllers/articles_controller';

export const articlesRouter = express.Router();

const usersController = new ArticlesController();

articlesRouter.post('/add', usersController.add)
articlesRouter.put('/modify', usersController.modify)
articlesRouter.delete('/delete', usersController.delete)