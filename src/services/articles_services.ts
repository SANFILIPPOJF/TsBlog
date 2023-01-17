import { client } from "../client";

export class ArticlesService{
    async getArticles()
    {
        const data = await client.query('SELECT * FROM articles');
        if(data.rowCount)
        {
            return data.rows;
        }
        return undefined
    }

    async getById(id: number)
    {
        const data = await client.query('SELECT * FROM articles WHERE id=$1', [id]);
        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

    async addArticle(message: string, userId: number)
    {
        const data = await client.query('INSERT INTO articles (message,created_by) VALUES ($1,$2) RETURNING *', [message,userId]);
        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

    async deleteArticle(id: number)
    {
        const data = await client.query('DELETE FROM articles WHERE id = $1', [id]);
        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

    async modifyArticle(id: number, message: string)
    {
        const data = await client.query('UPDATE articles SET message = $2 WHERE id = $1', [id, message]);
        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

    async articleCreatedBy(id: number)
    {
        const data = await client.query('SELECT created_by FROM articles WHERE id=$1', [id]);
        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }
}