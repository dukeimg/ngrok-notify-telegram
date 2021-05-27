const axios = require('axios');

module.exports = async (chatId, message) => {
  return await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    chat_id: chatId,
    text: message
  });
};
