import { client } from "../client";

export class CommentsService{
    async getCommentsFromArticle(articleId: number)
    {
        const data = await client.query('SELECT * FROM comments WHERE id_article = $1 AND deleted_at = null', [articleId]);
        if(data.rowCount)
        {
            return data.rows;
        }
        return undefined
    }
    async addComment(comment: string, userId: number, articleId: number)
    {
        const data = await client.query('INSERT INTO comments (id_article,id_user,comment) VALUES ($1,$2,$3) RETURNING *', [articleId,userId,comment]);
        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }
    async modifyComment(id: number, comment: string)
    {
        const data = await client.query('UPDATE comments SET comment = $2 WHERE id = $1 RETURNING *', [id, comment]);
        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }
    async deleteComment(id: number)
    {
        const data = await client.query('UPDATE comments SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *', [id]);
        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }
    async getCommentById(id: number)
    {
        const data = await client.query('SELECT * FROM comments WHERE id=$1', [id]);
        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }
}