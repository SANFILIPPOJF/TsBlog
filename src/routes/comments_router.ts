import express = require('express');
import { CommentsController } from '../controllers/comments_controller';

export const commentsRouter = express.Router();

const commentsController = new CommentsController();

commentsRouter.post('/add', commentsController.add)
commentsRouter.put('/modify', commentsController.modify)
commentsRouter.delete('/delete', commentsController.delete)
