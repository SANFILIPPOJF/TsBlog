import express = require('express');
import { ArticlesService } from '../services/articles_services';

const articlesService = new ArticlesService();

export class ArticlesController {

    async getAllArticles(req: express.Request, res: express.Response){
        try {
            const articles = await articlesService.getArticles();
            if (articles) {
                res.status(200).json({
                    status: "success",
                    data: articles
                })
                return;
            }
            res.status(404).json({
                status: "fail",
                message: "there's no article"
            })
        }
        catch (err) {
            res.status(500).json({ status: "fail", data: "Erreur serveur" })
        }
    }
    async getById(req: express.Request, res: express.Response){
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(406).json({
                status: "fail",
                message: "Id must be an integer"
            })
            return;
        }
        try {
            const article = await articlesService.getById(id);
            if (article) {
                res.status(200).json({
                    status: "success",
                    data: article
                })
                return;
            }
            res.status(404).json({
                status: "fail",
                message: "Article not found"
            })
        }
        catch (err) {
            res.status(500).json({ status: "fail", data: "Erreur serveur" })
        }
    }
    async postArticle(req: express.Request, res: express.Response){
        const message = req.body.message;
        const userId=req.user?.userId;

        if (message.length == 0) {
            res.status(412).json({
                status: "fail",
                data: "Article vide"
            })
            return;
        }
        try {
            const article = await articlesService.addArticle(message, userId);
            res.status(201).json({
                status: "success",
                data: article
            })
        }
    
        catch (err) {
            res.status(500).json({
                status: "fail",
                data: "Erreur serveur"
            })
        }
    }
    async patchArticle(req: express.Request, res: express.Response){
        const articleId = parseInt(req.params.id);
        const message = req.body.message;
        const userId = req.user?.userId;

        if (isNaN(articleId)) {
            res.status(412).json({
                status: "fail",
                message: "Id article non valide"
            })
            return;
        }
        const articleProperty = await articlesService.articleCreatedBy(articleId);
        
        if (userId!=articleProperty) {
            res.status(401).json({
                status: "fail",
                message: "Article n'appartient pas à ce user"
            })
            return;
        }
        if (message.length == 0) {
            res.status(412).json({
                status: "fail",
                message: "Article vide"
            })
            return;
        }
        
        try {
            const article = await articlesService.modifyArticle(articleId, message);
            
            res.status(202).json({
                status: "success",
                data: article
            })
        }
    
        catch (err) {
            res.status(500).json({ status: "fail", data: "Erreur serveur" })
        }
    
    }
    async deleteArticle(req: express.Request, res: express.Response){
        const articleId = parseInt(req.params.id);
        const userId = req.user?.userId;

        if (isNaN(articleId)) {
            res.status(412).json({
                status: "fail",
                data: "Id article non valide"
            })
            return;
        }
        const articleProperty = await articlesService.articleCreatedBy(articleId);
        if (userId!=articleProperty) {
            res.status(401).json({
                status: "fail",
                data: "Article n'appartient pas à ce user"
            })
            return;
        }

        try {
            const article = await articlesService.deleteArticle(userId);
            res.status(202).json({
                status: "success",
                data: article
            })
        }
        catch (err) {
            res.status(500).json({ status: "fail", data: "Erreur serveur" })
        }
    }
}