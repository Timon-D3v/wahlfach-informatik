export async function getHighscores(): Promise<number[]> {
    return JSON.parse(await Deno.readTextFile("highscores.txt"));
}

export async function setHighscore(scores: number[]): Promise<void> {
    await Deno.writeTextFile("highscores.txt", JSON.stringify(scores));
}