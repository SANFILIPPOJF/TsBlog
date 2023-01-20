import express = require('express');
import { CommentsController } from '../controllers/comments_controller';
import { authenticateJWT } from '../middleware/auth';
export const commentsRouter = express.Router();

const commentsController = new CommentsController();

commentsRouter.get('/', commentsController.getAllComments)
commentsRouter.post('/', authenticateJWT, commentsController.addComment)
commentsRouter.patch('/:id', authenticateJWT, commentsController.modifyComment)
commentsRouter.delete('/:id', authenticateJWT, commentsController.deleteComment)
