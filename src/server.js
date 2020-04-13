import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { json } from 'body-parser';
import { saveToBlockchain } from './api/post-journal';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const app =
    polka()
    .use(json)
    .get('/api/test', (req, res) => {
        res.end('Hello World');
    })
    .get('/api/test_json', (req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ hello: 'world' }));
    })
    .post('/api/save_to_blockchain', (req, res) => {
        const post = req.body;
        try {
            const result = await saveToBlockchain(post);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } catch (e) {
            res.writeHead(500);
            res.end('Server Error');
        }
    })
    .use(
        compression({ threshold: 0 }),
        sirv('static', { dev }),
        sapper.middleware()
    )
    .listen(PORT, err => {
        if (err) console.log('error', err);
    });

export default app.handler;