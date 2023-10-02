import { db } from "../database/database.connection.js";
import bcrypt from 'bcrypt';
import { v4 as uuid} from 'uuid';

export async function signUp(req, res) {
    const {name, email, password} = req.body;

    const hash = bcrypt.hashSync(password, 10)

    try{
        const existUser = await db.query(`SELECT email FROM users WHERE email = $1`, [email]);
        if(existUser.rows[0]) return res.status(409).send('user already exists');

        await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,[name, email, hash])
        res.status(201).send("Created");
    }catch (err){
        res.status(500).send(err.message)
    }
}

export async function signIn(req, res) {
    const {email, password} = req.body;

    try{
        const user = await db.query(`SELECT email, id, password FROM users WHERE email = $1;`,[email]);
        if(!user.rows[0]) return res.status(401).send('user does not exists');

        const rightPassword = user && bcrypt.compareSync(password, user.rows[0].password);
        if(!rightPassword) return res.status(401).send('incorrect password');

        const token = uuid();

        const sendToken={token};

        await db.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2);`,[user.rows[0].id, token]);
        res.status(200).send(sendToken);
    }catch (err){
        res.status(500).send(err.message)
    }
}

export async function getUserInfo(req, res) {

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) return response.status(401).send("Token not sended");

    try{
        const session = await db.query(`SELECT token, "userId" FROM sessions WHERE token = $1;`,[token]);
        if(!session.rows[0]) return res.status(401).send("Unauthorized");

        const userInfo = await db.query(`
            SELECT users.id, users.name, SUM("visitCount") AS "visitCount" FROM "shortenedUrls"
            JOIN users ON users.id = "shortenedUrls"."userId"
            WHERE "userId" = $1
            GROUP BY users.id;
            `,[session.rows[0].userId]);

        const shortenedUrls = await db.query(`SELECT id, "shortUrl", url, "visitCount" FROM "shortenedUrls" WHERE "userId" = $1;`,[userInfo.rows[0].id]);
        const userData = {... userInfo.rows[0], shortenedUrls: shortenedUrls.rows};
        res.send(userData);
    }catch (err){
        res.status(500).send(err.message)
    }
}