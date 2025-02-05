export async function getHighscores(): Promise<number[]> {
  return JSON.parse(await Deno.readTextFile("highscores.json"));
}

export async function setHighscore(scores: number[]): Promise<void> {
  await Deno.writeTextFile("highscores.json", JSON.stringify(scores));
}
