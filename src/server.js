import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const app =
    polka()
    .get('/api/test', (req, res) => {
        res.end('Hello World');
    })
    .get('/api/test_json', (req, res) => {
        res.end(JSON.stringify({ hello: 'world' }));
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