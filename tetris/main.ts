import express, { Request, Response } from 'npm:express';
import _ejs from "npm:ejs";

const app = express();
const port = 8080;
const highscores = new Array(10).fill(0);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
    res.render("index.ejs");
});

app.get("/highscores", (_req: Request, res: Response) => {
    res.json(highscores);
});

app.post("/setScore", (req: Request, res: Response) => {
    const score = req.body.score;
    highscores.push(score);
    highscores.sort((a, b) => b - a);
    highscores.pop();
    res.json(highscores);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});