const axios = require("axios");

const coinGeckoAPI = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 1000,
});

export default coinGeckoAPI;
