const { flights } = require("./data");
console.log(flights.SA231);
const rawdata = flights.SA231.map((seat) => {
  return { _id: seat.id, isAvailable: seat.isAvailable };
});

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbName = "projectSlingAir";
const collectionName = "SA231";

const client = new MongoClient(MONGO_URI, options);
const db = client.db(dbName);

const importData = async (req, res) => {
  await client.connect();
  console.log("connected");

  await db.collection(collectionName).drop();
  await db.collection(collectionName).insertMany(rawdata);

  client.close();
  console.log("disconnected");

  return;
};

importData();
