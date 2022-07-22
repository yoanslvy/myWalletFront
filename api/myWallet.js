const axios = require("axios");

const myWalletAPI = axios.create({
  baseURL: "https://mywallet-back-prod.herokuapp.com", // Adresse IP du PC qui host le backend
  timeout: 1000,
});

export default myWalletAPI;
