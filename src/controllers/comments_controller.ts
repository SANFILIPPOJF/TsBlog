import express = require('express');
import { EStatus } from '../constant/const';
import { ArticlesService } from '../services/articles_services';
import { CommentsService } from '../services/comments_services';
import { TApiResponse } from '../types/types';

const commentsService = new CommentsService();
const articlesService = new ArticlesService();
export class CommentsController {
    async getAllComments(req: express.Request, res: express.Response) {
        const articleId = parseInt(req.body.articleId)
        if (isNaN(articleId)) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Unvalid article Id"
            }
            res.status(400).json(response)
            return;
        }
        try {
            const articleExist = await articlesService.getById(articleId);
            if (!articleExist) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "Article not found"
                }
                res.status(404).json(response)
                return;
            }
            if (articleExist.deleted_at) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "Article deleted"
                }
                res.status(403).json(response)
                return;
            }
            const comments = await commentsService.getCommentsFromArticle(articleId);
            if (comments) {
                const response: TApiResponse = {
                    status: EStatus.OK,
                    data: comments,
                    message: "Comment(s) loaded"
                }
                res.status(200).json(response)
                return;
            }
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "No comment"
            }
            res.status(404).json(response)
        }
        catch (err) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Server error" }
            res.status(500).json(response)
        }
    }
    async addComment(req: express.Request, res: express.Response) {
        const { articleId, comment } = req.body;
        const userId=req.user?.userId;

        if (isNaN(articleId)) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Unvalid article Id"
            }
            res.status(400).json(response)
            return;
        }
        if (!comment) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Comment can't be empty"
            }
            res.status(400).json(response)
            return;
        }
        try {
            const articleExist = await articlesService.getById(articleId);
            if (!articleExist) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "Article not found"
                }
                res.status(404).json(response)
                return;
            }
            if (articleExist.deleted_at) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "Article deleted, impossible to comment"
                }
                res.status(403).json(response)
                return;
            }
            const newComment = await commentsService.addComment(comment,userId,articleId);
            const response: TApiResponse = {
                status: EStatus.OK,
                data: newComment,
                message: "Comment posted"
            }
            res.status(201).json(response)

            return;
        } catch (error) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Erreur serveur"
            }
            res.status(500).json(response)
        }
    }
    async modifyComment(req: express.Request, res: express.Response) {
        const comment = req.body.comment;
        const commentId = parseInt(req.params.id);
        const userId=req.user?.userId;

        if (isNaN(commentId)) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Unvalid comment Id"
            }
            res.status(400).json(response)
            return;
        }
        if (!comment) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Comment can't be empty"
            }
            res.status(400).json(response)
            return;
        }
        try {
            const storedComment = await commentsService.getCommentById(commentId);
            if (!storedComment) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "Comment not found"
                }
                res.status(404).json(response)
                return;
            }
            if (userId!=storedComment.id_user) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "User can't modify this comment"
                }
                res.status(401).json(response)
                return;
            }
            if (storedComment.deleted_at) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "Impossible to modify a deleted comment"
                }
                res.status(401).json(response)
                return;
            }
            const articleExist = await articlesService.getById(storedComment.id_article);
            if (!articleExist) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "Article not found"
                }
                res.status(404).json(response)
                return;
            }
            if (articleExist.deleted_at) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "Article deleted, impossible to modify comment"
                }
                res.status(401).json(response)
                return;
            }
            const newComment = await commentsService.modifyComment(commentId,comment);
            const response: TApiResponse = {
                status: EStatus.OK,
                data: newComment,
                message: "Comment modified"
            }
            res.status(201).json(response)
            return;
        } catch (error) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Server error"
            }
            res.status(500).json(response)
        }
    }
    async deleteComment(req: express.Request, res: express.Response) {
        const commentId = parseInt(req.params.id);
        const userId=req.user?.userId;

        if (isNaN(commentId)) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Unvalid Comment Id"
            }
            res.status(400).json(response)
            return;
        }
        try {
            const storedComment = await commentsService.getCommentById(commentId);
            if (!storedComment) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "Comment not found"
                }
                res.status(404).json(response)
                return;
            }
            if (userId!=storedComment.id_user) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "User not authorized to deleted this comment"
                }
                res.status(403).json(response)
                return;
            }
            if (storedComment.deleted_at) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "Comment already deleted"
                }
                res.status(401).json(response)
                return;
            }
            const articleExist = await articlesService.getById(storedComment.id_article);
            if (!articleExist) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "article not found"
                }
                res.status(404).json(response)
                return;
            }
            if (articleExist.deleted_at) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "Article already deleted, impossible to delete comment"
                }
                res.status(401).json(response)
                return;
            }
            const deletedComment = await commentsService.deleteComment(commentId);
            const response: TApiResponse = {
                status: EStatus.OK,
                data: deletedComment,
                message: "Comment deleted"
            }
            res.status(201).json(response)
            return;
        } catch (error) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Server error"
            }
            res.status(500).json(response)
        }
    }
}