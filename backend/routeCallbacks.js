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

const getAllSeats = async (req, res) => {
  const collectionName = "SA231";
  await client.connect();
  console.log("connected");
  try {
    const seats = await db.collection(collectionName).find().toArray();
    client.close();
    console.log("disconnected");

    sendResponse(
      res,
      200,
      {
        seats: seats,
      },
      ""
    );
  } catch (err) {
    console.log(err);
  }
};

function sendResponse(res, status, data, message = "") {
  return res.status(status).json({
    status,
    data,
    message,
  });
}

module.exports = { getAllSeats };
