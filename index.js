#! /usr/bin/env node

//import axios2 from "./node_modules/axios/dist/axios.min.js";
const axios = require("axios");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "enter command >",
});

readline.prompt();

readline.on("line", async (line) => {
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
    case "log":
      {
        const { data } = await getData();
        //console.log(data);
        const it = data[Symbol.iterator]();
        let actionIt;
        const actionIterator = {
          [Symbol.iterator]() {
            const positions = [...this.actions];
            return {
              [Symbol.iterator]() {
                return this;
              },
              next(...args) {
                if (positions.length > 0) {
                  const position = positions.shift();
                  const result = position(...args);
                  return { value: result, done: false };
                } else {
                  return { done: true };
                }
              },
              return() {
                positions = [];
                return { done: true };
              },
              throw(error) {
                console.log(error);
                return { value: undefined, done: true };
              },
            };
          },
          actions: [askForServingSize, displayCalories],
        };

        function askForServingSize(food) {
          readline.question(
            `How many servings did you eat? ( as a decimal: 1, 0.5, 1.25, etc... )`,
            (servingSize) => {
              if (servingSize === "nevermind" || servingSize === "n") {
                actionIt.return();
              } else {
                actionIt.next(servingSize, food);
              }
            }
          );
        }

        function displayCalories(servingSize, food) {
          const calories = food.calories;
          console.log(
            `${
              food.name
            } with a serving size of ${servingSize} has a ${Number.parseFloat(
              calories * parseInt(servingSize, 10)
            ).toFixed()} calories. `
          );

          actionIt.next();
          readline.prompt();
        }

        readline.question(`What would you like to log today?`, async (item) => {
          //const { data } = await axios.get(`http://localhost:3001/food`);
          //const { data } = await axios.get(`http://localhost:3001/food`);
          //console.log(data);

          let position = it.next();
          while (!position.done) {
            const food = position.value.name;
            if (food === item) {
              console.log(`${item} has ${position.value.calories} calories`);
              actionIt = actionIterator[Symbol.iterator]();
              actionIt.next(position.value);
            }
            position = it.next();
          }

          readline.prompt();
        });
        break;
      }
      readline.prompt();
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
