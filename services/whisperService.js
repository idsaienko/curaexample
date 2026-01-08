const axios = require ("axios");
const FormData = require("form-data");

const WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions";

 async function transcribeAudio(buffer, mimeType, retries = 2) {
  try {
    const apiKey = process.env.LLM_API_KEY;

    if (!apiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    const form = new FormData();
    form.append("file", buffer, {
      filename: "audio.webm",
      contentType: mimeType
    });
    form.append("model", "whisper-1");

    const response = await axios.post(WHISPER_URL, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!response.data?.text) {
      throw new Error("Whisper returned empty transcription");
    }
    return response.data.text;
  
  } catch (err) {
    if (retries > 0) {
      return transcribeAudio(buffer, mimeType, retries - 1);
    }
    throw err;
  }
}
