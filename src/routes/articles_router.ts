import express = require('express');
import { ArticlesController } from '../controllers/articles_controller';
import { authenticateJWT } from '../middleware/auth';

export const articlesRouter = express.Router();

const articlesController = new ArticlesController();

articlesRouter.get('/', articlesController.getAllArticles)
articlesRouter.get('/:id', articlesController.getById)
articlesRouter.post('/', authenticateJWT, articlesController.postArticle)
articlesRouter.patch('/:id', authenticateJWT, articlesController.patchArticle)
articlesRouter.delete('/:id', authenticateJWT, articlesController.deleteArticle)