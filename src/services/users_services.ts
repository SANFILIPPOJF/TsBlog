import { client } from "../client";

export class UsersService{
    async getUserByName(name: string)
    {
        const data = await client.query('SELECT * FROM users WHERE name=$1', [name]);
        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

    async addUser(name: string, hash: string)
    {
        const data = await client.query('INSERT INTO users (name,password) VALUES ($1,$2) RETURNING *', [name, hash]);
        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }
}