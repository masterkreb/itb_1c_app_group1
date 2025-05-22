import express from 'express';
import bodyParser from 'body-parser';
import filmRouter from './routes/film';
import actorRouter from './routes/actor';
import categoryRouter from './routes/category';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(bodyParser.json());

app.use('/film', filmRouter);
app.use('/actor', actorRouter);
app.use('/category', categoryRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
