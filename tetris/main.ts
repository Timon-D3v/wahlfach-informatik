import { getHighscores, setHighscore } from "./components/fileOperations.ts";
import express, { Request, Response } from "npm:express";
import _ejs from "npm:ejs";

const app = express();
const port = 8080;
const host = "0.0.0.0"

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.render("index.ejs");
});

app.get("/highscores", async (_req: Request, res: Response) => {
  res.json({ scores: await getHighscores() });
});

app.post("/setScore", async (req: Request, res: Response) => {
  const highscores = await getHighscores();

  highscores.push(req.body.score);
  highscores.sort((a, b) => b - a);
  highscores.pop();

  setHighscore(highscores);
  res.json({ scores: highscores });
});

app.listen(port, host, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
