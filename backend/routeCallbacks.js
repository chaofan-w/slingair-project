const { MongoClient } = require("mongodb");
require("dotenv").config();
// first require dotenv.config(), then get MONGO_URI from process.env
const { MONGO_URI } = process.env;
const ObjectId = require("mongodb").ObjectId;

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
      .find({
        order: {
          $elemMatch: {
            flight: flightnum.toUpperCase(),
            //https://www.thecodebuzz.com/mongodb-query-for-documents-array-size-is-greater-than-mongoshell-cli-node-js/ MongoDB Query for documents array size is greater than
            // seat: { $type: "array", $ne: [] },

            // return all the records where the array size is greater than or equal to 1
            "seat.0": { $exists: true },
          },
        },
      })
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
    // ------https://www.mongodb.com/docs/manual/core/index-case-insensitive/------
    // create case insensitive index on collection with a defualt collation to ignore case when comparing two strings

    // //----- before creating new index, check and drop existing index to avoid conflict, https://www.mongodb.com/docs/manual/reference/method/db.collection.dropIndex/-----------------
    //     await db.collection("customers").dropIndex({ last_name: 1 });

    // // ----------- create new index, {last_name:1}, it indicates the field to create index to, 1 means in ascending order, the key name will be last_name_1
    //     await db.collection("customers").createIndex(
    //       { last_name: 1 },
    // //------- in collation, to define the rule, locale is mandatory, 'en' is english, strength:1 means only compare the characters, ignore the case
    //       {
    //         collation: {
    //           locale: "en",
    //           strength: 1,
    //         },
    //       }
    //     );

    // await db.collection("customers").createIndex(
    //   {
    //     email: 1,
    //   },
    //   {
    //     collation: {
    //       locale: "en",
    //       strength: 1,
    //     },
    //   }
    // );
    const customer = await db
      .collection("customers")
      .find({
        //https://stackoverflow.com/questions/26699885/how-can-i-use-a-regex-variable-in-a-query-for-mongodb use dynampic value in regex of mongodb plus options, but it is not ok for query here
        // last_name: { $regex: "^" + last_name, $options: "i" },
        // email: { $regex: "^" + email, $options: "i" },
        last_name: last_name,
        email: email,
      })
      .collation({ locale: "en", strength: 1 })
      .toArray();

    const orderInfo = await db
      .collection("reservations")
      .find({ email: email.toLowerCase() })
      .toArray();

    client.close();
    console.log("disconnected");
    if (customer.length > 0) {
      sendResponse(
        res,
        200,
        { ...customer[0], reservations: [...orderInfo] },
        ""
      );
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

    // console.log(accountExist);

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

const deActivateCustomers = async (req, res) => {
  await client.connect();
  console.log("connected");
  const emailArr = req.body;
  console.log(emailArr);
  try {
    const updatedCustomers = await db
      .collection("customers")
      .updateMany(
        { email: { $in: emailArr }, activated: true },
        { $set: { activated: false } }
      );
    client.close();
    console.log("disconnected");
    if (updatedCustomers.modifiedCount > 0) {
      sendResponse(
        res,
        200,
        null,
        `${updatedCustomers.modifiedCount} accounts have been deactivated`
      );
      return;
    } else {
      sendResponse(res, 404, null, "the accounts are already deactivated");
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

const changeSeatsAvailablity = async (req, res) => {
  const { flightNum } = req.body;
  await client.connect();
  console.log("connected");
  try {
    // await db.collection("reservations").createIndex(
    //   { "order.flight": 1 },
    //   {
    //     collation: { locale: "en", strength: 1 },
    //   }
    // );

    const allReservations = await db
      .collection("reservations")
      .find({ order: { $elemMatch: { flight: flightNum } } })
      .collation({ locale: "en", strength: 1 })
      .toArray();
    client.close();
    console.log("disconnected");
    if (allReservations.length > 0) {
      const reservedSeats = allReservations.reduce((pre, curr) => {
        return [
          ...pre,
          ...curr.order.find((f) => f.flight === flightNum.toUpperCase()).seat,
        ];
      }, []);
      console.log(reservedSeats);

      await db.collection(`${flightNum.toUpperCase()}`).updateMany(
        { _id: { $in: reservedSeats } },
        {
          $set: {
            isAvailable: false,
          },
        }
      );
      await db.collection(`${flightNum.toUpperCase()}`).updateMany(
        { _id: { $nin: reservedSeats } },
        {
          $set: {
            isAvailable: true,
          },
        }
      );

      sendResponse(res, 200, reservedSeats, "");
    } else {
      sendResponse(res, 404, null, "no reservation in database so far.");
    }
  } catch (err) {
    console.log(err);
  }
};

const addReservations = async (req, res) => {
  await client.connect();
  console.log("connected");
  const {
    email,
    order: [{ flight, seat }],
  } = req.body;
  console.log(flight);
  console.log(seat);
  try {
    const newReservations = await db.collection("reservations").insertOne({
      email: email,
      order: [{ flight: flight, seat: seat }],
    });
    client.close();
    console.log("disconnected");
    sendResponse(res, 200, null, "tickets booked successfully");
  } catch (err) {
    console.log(err);
  }
};

const cancelReservations = async (req, res) => {
  const { flight, seat, orderId } = req.body;
  await client.connect();
  console.log("connected");
  try {
    const updateResult = await db.collection("reservations").updateOne(
      {
        _id: ObjectId(orderId),
        order: { $elemMatch: { flight: flight } },
      },
      {
        $pull: {
          "order.$[].seat": seat,
        },
      }
    );
    if (updateResult.modifiedCount > 0) {
      console.log(updateResult.modifiedCount);
      sendResponse(res, 200, null, "reservation cancelled");
      client.close();
      console.log("disconnected");
      return;
    } else {
      sendResponse(res, 404, null, "no matched seat found");
      client.close();
      console.log("disconnected");
    }
  } catch (err) {
    console.log(err);
  }
};

// ----------https://www.prisma.io/dataguide/mongodb/managing-documents----------

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
  deActivateCustomers,
  changeSeatsAvailablity,
  addReservations,
  cancelReservations,
};
