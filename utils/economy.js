const fs = require("fs");

const ecoFile = "./data/economy.json";

function loadData() {

  if (!fs.existsSync(ecoFile)) {
    fs.writeFileSync(ecoFile, "{}");
  }

  return JSON.parse(
    fs.readFileSync(ecoFile, "utf8")
  );

}

function saveData(data) {

  fs.writeFileSync(
    ecoFile,
    JSON.stringify(data, null, 2)
  );

}

function getUser(data, id) {

  if (!data[id]) {

    data[id] = {
      cash: 0,
      bank: 0,
      inventory: [],
      daily: 0,
      work: 0,
      crime: 0,
      beg: 0
    };

  }

  return data[id];

}

module.exports = {
  loadData,
  saveData,
  getUser
};
