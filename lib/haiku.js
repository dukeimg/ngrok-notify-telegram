const axios = require('axios');
const axiosRetry = require('axios-retry');
const dataset = require('./haiku_dataset.json')

axiosRetry(axios, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return 30000; // time interval between retries
  },
  // retryCondition: (error) => {
  //   // if retry condition is not specified, by default idempotent requests are retried
  //   return error.response.status === 503;
  // },
});

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
