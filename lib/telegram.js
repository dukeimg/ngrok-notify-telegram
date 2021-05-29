const axios = require('axios');

const sendMessage = async (chatId, message) => {
  return await axios
    .post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: message
    })
    .then((response) => response.data.result.message_id);
};

const pinMessage = async (chatId, messageId) => {
  await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/pinChatMessage`, {
    chat_id: chatId,
    message_id: messageId,
    disable_notification: true,
  });
}

const unpinMessages = async (chatId) => {
  await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/unpinAllChatMessages`, {
    chat_id: chatId,
  });
}

module.exports = {
  sendMessage,
  pinMessage,
  unpinMessages
}
