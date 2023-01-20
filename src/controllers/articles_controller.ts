import express = require('express');
import { EStatus } from '../constant/const';
import { ArticlesService } from '../services/articles_services';
import { TApiResponse } from '../types/types';

const articlesService = new ArticlesService();

export class ArticlesController {

    async getAllArticles(req: express.Request, res: express.Response) {
        try {
            const articles = await articlesService.getArticles();
            if (articles) {
                const response: TApiResponse = {
                    status: EStatus.OK,
                    data: articles,
                    message: "Article(s) loaded"
                }
                res.status(200).json(response)
                return;
            }
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "No article to load"
            }
            res.status(404).json(response)
        }
        catch (err) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Server error"
            }
            res.status(500).json(response)
        }
    }
    async getById(req: express.Request, res: express.Response) {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Param Id uncorrect"
            }
            res.status(400).json(response)
            return;
        }
        try {
            const article = await articlesService.getById(id);
            if (article) {
                const response: TApiResponse = {
                    status: EStatus.OK,
                    data: article,
                    message: "Article loaded"
                }
                res.status(200).json(response)
                return;
            }
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Article not found"
            }
            res.status(404).json(response)
        }
        catch (err) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Server error"
            }
            res.status(500).json(response)
        }
    }
    async postArticle(req: express.Request, res: express.Response) {
        const message = req.body.message;
        const userId = req.user?.userId;

        if (!message) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Article can't be empty"
            }
            res.status(400).json(response)
            return;
        }
        try {
            const article = await articlesService.addArticle(message, userId);
            const response: TApiResponse = {
                status: EStatus.OK,
                data: article,
                message: "Article posted"
            }
            res.status(201).json(response)
        }
        catch (err) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Server Error"
            }
            res.status(500).json(response)
        }
    }
    async patchArticle(req: express.Request, res: express.Response) {
        const articleId = parseInt(req.params.id);
        const message = req.body.message;
        const userId = req.user?.userId;

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
            const StoredArticle = await articlesService.getById(articleId);

            if (userId != StoredArticle.id_user) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "User can't modify this article"
                }
                res.status(401).json(response)
                return;
            }
            if (message.length == 0) {
                const response: TApiResponse = {
                    status: EStatus.FAIL,
                    data: null,
                    message: "Article can't be empty"
                }
                res.status(404).json(response)
                return;
            }

            const article = await articlesService.modifyArticle(articleId, message);
            const response: TApiResponse = {
                status: EStatus.OK,
                data: null,
                message: "Article modified"
            }
            res.status(200).json(response)
        }
        catch (err) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Server error"
            }
            res.status(500).json(response)
        }

    }
    async deleteArticle(req: express.Request, res: express.Response) {
        const articleId = parseInt(req.params.id);
        const userId = req.user?.userId;

        if (isNaN(articleId)) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Unvalid article ID"
            }
            res.status(400).json(response)
            return;
        }
        const articleProperty = await articlesService.getById(articleId);
        if (userId != articleProperty.id_user) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "User can't delete this article"
            }
            res.status(401).json(response)
            return;
        }
        try {
            const article = await articlesService.deleteArticle(userId);
            const response: TApiResponse = {
                status: EStatus.OK,
                data: article,
                message: "Article deleted"
            }
            res.status(200).json(response)
        }
        catch (err) {
            const response: TApiResponse = {
                status: EStatus.FAIL,
                data: null,
                message: "Server Error"
            }
            res.status(500).json(response)
        }
    }
}