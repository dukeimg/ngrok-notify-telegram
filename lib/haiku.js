const axios = require('axios');
const dataset = require('./haiku_dataset.json')

const writeHaiku = async (length) => {
  const prompt = dataset[Math.floor(Math.random() * dataset.length)];
  console.log(`Haiku input: \n\n ${prompt} \n\n`);
  return await axios.post('http://localhost:8000/gpt2_poetry/', {
    prompt,
    length,
  }).then((response) => response.data.replies[0]);
}

module.exports = {
  writeHaiku
}
