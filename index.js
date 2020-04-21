#! /usr/bin/env node

//import axios2 from "./node_modules/axios/dist/axios.min.js";
const axios = require("axios");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "enter command >",
});

readline.prompt();

readline.on("line", (line) => {
  switch (line.trim()) {
    case "list vegan foods":
      {
        console.log("vegan food list");
        axios.get(`http://localhost:3001/food`).then(({ data }) => {
          let idx = 0;
          const veganOnly = data.filter((food) => {
            return food.dietary_preferences.includes("vegan");
          });
          const veganIterable = {
            [Symbol.iterator]() {
              return {
                [Symbol.iterator]() {
                  return this;
                },
                next() {
                  const current = veganOnly[idx];
                  idx++;
                  if (current) {
                    return { value: current, done: false };
                  } else {
                    return { value: current, done: true };
                  }
                },
              };
            },
          };

          for (let val of veganIterable) {
            console.log(val.name);
          }
          readline.prompt();
        });
      }
      break;
    case "log": {
      readline.question(`What would you like to log today?`, async (item) => {
        //const { data } = await axios.get(`http://localhost:3001/food`);
        //const { data } = await axios.get(`http://localhost:3001/food`);
        //console.log(data);
        const { data } = await getData();
        console.log(data);
        const it = data[Symbol.iterator]();
        let position = it.next();
        while (!position.done) {
          const food = position.value.name;
          if (food === item) {
            console.log(`${item} has ${position.value.calories} calories`);
          }
          position = it.next();
        }

        readline.prompt();
      });
    }
  }
});

const getData = async () => {
  return await axios.get(`http://localhost:3001/food`);
  //const { data } = await axios.get(`http://localhost:3001/food`);
  //setText(JSON.stringify(data));
};

// export function setText(text) {
//   const newData = text;
//   console.log("new Data: " + newData);
//   return JSON.stringify(newData);
// }
