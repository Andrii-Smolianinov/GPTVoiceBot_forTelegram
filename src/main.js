import dotenv from "dotenv";
dotenv.config();
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { ogg } from "./ogg.js";
import { openai } from "./openai.js";

const { TELEGRAM_TOKEN } = process.env;
const bot = new Telegraf(TELEGRAM_TOKEN);

bot.on(message("voice"), async (context) => {
  try {
    const link = await context.telegram.getFileLink(
      context.message.voice.file_id
    );
    const userId = String(context.message.from.id);
    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.toMp3(oggPath, userId);

    const text = await openai.transcription(mp3Path);
    const response = await openai.chat(text);

    await context.reply(mp3Path);
  } catch (error) {
    console.log("Error voice message", error.message);
  }
});

bot.command("start", async (context) => {
  await context.reply(JSON.stringify(context.message, null, 2));
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
