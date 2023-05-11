import { Telegraf } from "telegraf";

const bot = new Telegraf("5868675011:AAGCfTLoGO3_Db2Rfni36O48UpGOGYfOl0M");

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
