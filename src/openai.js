import dotenv from "dotenv";
dotenv.config();
import { Configuration, OpenAIApi } from "openai";

const { OPENAI_API_KEY } = process.env;

class OpenAI {
  constructor() {
    const configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  chat() {}
  transcription() {}
}

export const openai = new OpenAI();
