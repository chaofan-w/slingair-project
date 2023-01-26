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

// const customers = require("./MOCK_Customers.json");
const reservations = require("./MOCK_Reservations.json");

client.connect();
console.log("connected");

db.createCollection("reservations");
// db.createCollection("customers");
// db.collection("customers").insertMany(customers);
db.collection("reservations").insertMany(reservations);

client.close();
console.log("disconnected");
