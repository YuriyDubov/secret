const express = require('express');
const { v4: uuidv4  } = require('uuid');
const crypto = require('crypto');
const sendQuery = require('../db/client');
const router = express.Router();

const algorithm = 'aes-256-cbc';
const key = process.env.KEY;
const iv = process.env.IV;

router.get('/:urlGuid', async function(req, res, next) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const urlGuid = req.params.urlGuid;

    if (!urlGuid) {
        res.send('Please provide urlGuid');
        return;
    }

    try {
        const rows = await sendQuery(`SELECT message FROM messages WHERE url = '${urlGuid}';`);
        let message = decipher.update(rows.rows[0]?.message || '', 'hex', 'utf8');
        message += decipher.final('utf8');

        const response = { text: message }
        res.send(response);
    } catch (err) {
        console.log(err);
        res.send('Something went wrong');
    }
});

router.post('/', async function(req, res, next) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    try {
        const uuid = uuidv4();
        const message = req.body.text ? req.body.text : '';
        let secretMessage = cipher.update(message, 'utf8', 'hex');
        secretMessage += cipher.final('hex');

        await sendQuery(`INSERT INTO messages (message, url) VALUES('${secretMessage}', '${uuid}');`);

        const response = { urlGuid: uuid };
        res.send(response);
    } catch (err) {
        console.log(err);
        res.send('Something went wrong');
    }
})

module.exports = router;
