import axios from "axios";

export const sendTelegramLog = async (text) => {
  try {
    await axios.post(
      `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TG_CHAT_ID,
        text,
        parse_mode: "HTML",
      },
    );
  } catch (error) {
    console.error("Telegram Log Error:", error.message);
  }
};
