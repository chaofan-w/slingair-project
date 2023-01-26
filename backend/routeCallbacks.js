const { MongoClient } = require("mongodb");
require("dotenv").config();
// first require dotenv.config(), then get MONGO_URI from process.env
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const dbName = "projectSlingAir";
const client = new MongoClient(MONGO_URI, options);
const db = client.db(dbName);

//--------- use params to get a specific flight's seat infomation--------------
const getAllSeats = async (req, res) => {
  const { flightnum } = req.params;
  console.log(flightnum);
  const collectionName = flightnum.toUpperCase();
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
        flightNum: collectionName,
        seats: seats,
      },
      ""
    );
  } catch (err) {
    console.log(err);
  }
};

const getAllReservations = async (req, res) => {
  await client.connect();
  console.log("connected");
  try {
    const allReservations = await db
      .collection("reservations")
      .find()
      .toArray();
    if (allReservations.length > 0) {
      sendResponse(res, 200, allReservations, "");
      client.close();
      console.log("disconnected");
      return;
    } else {
      sendResponse(res, 404, null, "no reservation in database so far.");
      client.close();
      console.log("disconnected");
      return;
    }
  } catch (err) {
    console.log(err);
  }
};
const getAllCustomers = async (req, res) => {
  await client.connect();
  console.log("connected");
  try {
    const allCustomers = await db.collection("customers").find().toArray();
    if (allCustomers.length > 0) {
      sendResponse(res, 200, allCustomers, "");
      client.close();
      console.log("disconnected");
      return;
    } else {
      sendResponse(res, 404, null, "no customers in database so far.");
      client.close();
      console.log("disconnected");
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

// --------- use params to get reservations of a specific flight -------------
const getFlightReservations = async (req, res) => {
  const { flightnum } = req.params;
  await client.connect();
  console.log("connected");
  try {
    const allReservations = await db
      .collection("reservations")
      .find({ "order.flight": flightnum.toUpperCase() })
      .toArray();
    client.close();
    console.log("disconnected");
    if (allReservations.length > 0) {
      sendResponse(res, 200, allReservations, "");
    } else {
      sendResponse(res, 404, null, "no reservation in database so far.");
    }
  } catch (err) {
    console.log(err);
  }
};

const getOneCustomer = async (req, res) => {
  const { last_name, email } = req.params;
  console.log(last_name + ": " + email);
  await client.connect();
  console.log("connected");
  try {
    const customer = await db
      .collection("customers")
      .find({
        //https://stackoverflow.com/questions/26699885/how-can-i-use-a-regex-variable-in-a-query-for-mongodb use dynampic value in regex of mongodb plus options, but it is not ok for query here
        // last_name: { $regex: "^" + last_name, $options: "i" },
        // email: { $regex: "^" + email, $options: "i" },
        last_name:
          last_name.slice(0, 1).toUpperCase() +
          last_name.slice(1).toLowerCase(),
        email: email.toLowerCase(),
      })
      .toArray();
    client.close();
    console.log("disconnected");
    if (customer.length > 0) {
      sendResponse(res, 200, customer, "");
    } else {
      sendResponse(res, 404, null, "no customer found");
    }
  } catch (err) {
    console.log(err);
  }
};

const addCustomer = async (req, res) => {
  const { first_name, last_name, email } = req.body;
  await client.connect();
  console.log("connected");
  try {
    const accountExist = await db
      .collection("customers")
      .find({ email: email })
      .toArray();

    console.log(accountExist);

    if (accountExist.length > 0) {
      sendResponse(
        res,
        400,
        null,
        "email already registered, please use another email."
      );
    } else {
      await db.collection("customers").insertOne({
        first_name: first_name,
        last_name: last_name,
        email: email,
      });
      sendResponse(res, 200, null, "account registered successfully");
    }
  } catch (err) {
    console.log(err);
  }
};

//-------- send response function for each call back--------------------------

function sendResponse(res, status, data, message = "") {
  return res.status(status).json({
    status,
    data,
    message,
  });
}

//---------- export callback functions for routes to use -----------------------
module.exports = {
  getAllSeats,
  getAllReservations,
  getAllCustomers,
  getFlightReservations,
  getOneCustomer,
  addCustomer,
};
