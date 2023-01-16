import express = require('express');
import { CommentsController } from '../controllers/comments_controller';

export const commentsRouter = express.Router();

const commentsController = new CommentsController();

commentsRouter.post('/add', commentsController.add)
commentsRouter.post('/modify', commentsController.modify)
commentsRouter.post('/delete', commentsController.delete)
