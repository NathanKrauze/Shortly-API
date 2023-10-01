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
        const shortenedUrl = await db.query(`SELECT id, "shortUrl" FROM "shortenedUrls" WHERE "userId"  = $1`,[session.rows[0].userId])
        res.status(201).send(shortenedUrl.rows[0]);
    }catch (err){
        res.status(500).send(err.message);
    }
}

export async function getUrlById(req, res) {
    try{

    }catch (err){
        res.status(500).send(err.message);
    }
}

export async function openUrl(req, res) {
    try{

    }catch (err){
        res.status(500).send(err.message);
    }
}

export async function deleteUrl(req, res) {
    try{

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