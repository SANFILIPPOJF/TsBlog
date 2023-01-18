import express = require('express');
import { EStatus } from '../constant/const';
import { ArticlesService } from '../services/articles_services';
import { CommentsService } from '../services/comments_services';
import { TApiResponse } from '../types/types';

const commentsService = new CommentsService();
const articlesService = new ArticlesService();
export class CommentsController {
    async getAllComment(req: express.Request, res: express.Response) {
        const articleId = req.body.id_article
        if (isNaN(articleId)) {
            res.status(406).json({
                status: "fail",
                message: "Id must be an integer"
            })
            return;
        }
        try {
            const articleExist = await articlesService.getById(articleId);
            if (!articleExist) {
                res.status(404).json({
                    status: "fail",
                    message: "Article not found"
                })
                return;
            }
            if (!articleExist.deleted_at){
                res.status(403).json({
                    status: "fail",
                    message: "Article deleted"
                })
                return;
            }
            const comments = await commentsService.getCommentsFromArticle(articleId);
            if (comments) {
                res.status(200).json({
                    status: "success",
                    data: comments
                })
                return;
            }
            res.status(404).json({
                status: "fail",
                message: "No comment"
            })
        }
        catch (err) {
            const response: TApiResponse = { status: EStatus.FAIL, data: null, message: "Erreur serveur" }
            res.status(500).json(response)
        }
    }
    async addComment(req: express.Request, res: express.Response) {
        const {articleId,userId,comment}= req.body;
        const articleExist = await articlesService.getById(articleId);
        if (!articleExist) {
            res.status(404).json({
                status: "fail",
                message: "Article not found"
            })
            return;
        }
    }
    async modifyComment(req: express.Request, res: express.Response) {

    }
    async deleteComment(req: express.Request, res: express.Response) {

    }
}