import { client } from "../client";

export class articlesService{
    async getArticles()
    {
        const data = await client.query('SELECT * FROM articles');
        if(data.rowCount)
        {
            return data.rows;
        }
        return undefined
    }

    async getArticleByID(name: string)
    {
        const data = await client.query('SELECT * FROM users WHERE name=$1', [name]);
        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

    async addArticle(name: string, hash: string)
    {
        const data = await client.query('INSERT INTO users (name,password) VALUES ($1,$2) RETURNING *', [name, hash]);
        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

    async deleteArticle(name: string, hash: string)
    {
        const data = await client.query('INSERT INTO users (name,password) VALUES ($1,$2) RETURNING *', [name, hash]);
        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

    async modifyArticle(name: string, hash: string)
    {
        const data = await client.query('INSERT INTO users (name,password) VALUES ($1,$2) RETURNING *', [name, hash]);
        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }
}