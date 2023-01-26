const numRow = 10;
const numColumn = ["A", "B", "C", "D", "E", "F"];
const numFlight = ["SA231", "SA232", "SA233"];
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbName = "projectSlingAir";

const client = new MongoClient(MONGO_URI, options);
const db = client.db(dbName);

const generateSeats = () => {
  let seats = [];
  for (let i = 1; i <= numRow; i++) {
    numColumn.forEach((column) => {
      seats.push({
        _id: `${i}-${column}`,
        isAvailable: !(Math.floor(Math.random() * 6) + 1 === 5),
      });
    });
  }
  return seats;
};

client.connect();
console.log("connected");

numFlight.forEach(async (flight) => {
  await db.createCollection(flight);
  await db.collection(flight).insertMany(generateSeats());
});

client.close();
console.log("disconnected");
