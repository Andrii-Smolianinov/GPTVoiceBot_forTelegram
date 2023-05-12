import dotenv from "dotenv";
dotenv.config();
import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { code } from "telegraf/format";
import { ogg } from "./ogg.js";
import { openai } from "./openai.js";
const INITIAL_SESSION = {
  messages: [],
};

const { TELEGRAM_TOKEN } = process.env;
const bot = new Telegraf(TELEGRAM_TOKEN);

bot.use(session());

bot.command("new", async (context) => {
  context.session = INITIAL_SESSION;
  await context.reply("Чекаю на Ваше голосове, або текстове повідомлення");
});

bot.command("start", async (context) => {
  context.session = INITIAL_SESSION;
  await context.reply("Чекаю на Ваше голосове, або текстове повідомлення");
});

bot.on(message("voice"), async (context) => {
  context.session ??= INITIAL_SESSION;
  try {
    await context.reply(
      code("Обробляється голосове повідомлення. Зачекайте...")
    );
    const link = await context.telegram.getFileLink(
      context.message.voice.file_id
    );
    const userId = String(context.message.from.id);
    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.toMp3(oggPath, userId);
    const text = await openai.transcription(mp3Path);
    await context.reply(code(`Ваш запит: - "${text}"`));

    context.session.messages.push({ role: openai.roles.USER, content: "text" });
    const response = await openai.chat(messages);

    await context.reply(response.content);
  } catch (error) {
    console.log("Error voice message", error.message);
  }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
