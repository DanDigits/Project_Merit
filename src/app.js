const axios = require("axios");

function getUserData() {
  axios
    .get("https://merit.testing.systems/Dashboard/Home")
    .then((response) => console.log(response.data))
    .catch((error) => console.log(error));
}

getUserData();
