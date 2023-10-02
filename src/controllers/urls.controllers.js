import { db } from "../database/database.connection.js";
import { customAlphabet } from "nanoid/non-secure";

export async function postUrl(req, res) {
    const { url } = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) return response.status(401).send("Token not sended");

    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8);
    const shortUrl = nanoid();

    try{
        const session = await db.query(`SELECT token, "userId" FROM sessions WHERE token = $1;`,[token]);
        if(!session.rows[0]) return res.status(401).send("Unauthorized");

        await db.query(`INSERT INTO "shortenedUrls" ("userId", url, "shortUrl") VALUES ($1, $2, $3);`,[session.rows[0].userId, url, shortUrl]);
        const shortenedUrl = await db.query(`SELECT id, "shortUrl" FROM "shortenedUrls" WHERE "userId"  = $1`,[session.rows[0].userId]);
        res.status(201).send(shortenedUrl.rows[0]);
    }catch (err){
        res.status(500).send(err.message);
    }
}

export async function getUrlById(req, res) {
    const {id} = req.params;
    try{
        const url = await db.query(`SELECT id, "shortUrl", url, "createdAt" FROM  "shortenedUrls" WHERE id = $1`,[id]);
        if(!url.rows[0]) return res.status(404).send('url not founded')
        res.status(200).send(url.rows[0])
    }catch (err){
        res.status(500).send(err.message);
    }
}

export async function openUrl(req, res) {
    const {shortUrl} = req.params;  
    try{
        const url = await db.query(`SELECT url FROM "shortenedUrls" WHERE "shortUrl" = $1`,[shortUrl]);
        if(!url.rows[0]) return res.status(404).send('url not founded');
        res.redirect(url.rows[0].url);
    }catch (err){
        res.status(500).send(err.message);
    }
}

export async function deleteUrl(req, res) {
    const {id} = req.params;

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) return response.status(401).send("Token not sended");

    try{
        const session = await db.query(`SELECT token, "userId" FROM sessions WHERE token = $1;`,[token]);
        if(!session.rows[0]) return res.status(401).send("Unauthorized");

        const validUrl = await db.query(`SELECT id FROM "shortenedUrls" WHERE id=$1`,[id]);
        if(!validUrl.rows[0]) return res.status(404).send("shortUrl not found");

        const validUserFromUrl = await db.query(`
            SELECT *
            FROM "shortenedUrls"
            JOIN sessions ON "shortenedUrls"."userId" = sessions."userId"
            WHERE "shortenedUrls".id = $1 AND sessions.token = $2;
            `,[id, token]);
        if(!validUserFromUrl.rows[0]) return res.status(401).send('unauthorized');
        await db.query(`DELETE FROM "shortenedUrls" WHERE id = $1`,[id]);
        res.status(204).send('deleted');
    }catch (err){
        res.status(500).send(err.message);
    }
}

export async function getRanking(req, res) {
    try{
        
    }catch (err){
        res.status(500).send(err.message);
    }
}