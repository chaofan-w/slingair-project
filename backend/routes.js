const router = require("express").Router();
const {
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
} = require("./routeCallbacks");

router.get("/", (req, res) => {
  sendResponse(res, 200, "data respond", "this is the homepage message");
});

router.get("/api/seats/:flightnum", getAllSeats);

router.get("/api/reservations/all", getAllReservations);
router.get("/api/reservations/:flightnum", getFlightReservations);
router.get("/api/reservations", changeSeatsAvailablity);
router.post("/api/reservations", addReservations);
router.patch("/api/reservations", cancelReservations);

router.get("/api/customers/all", getAllCustomers);
router.get("/api/customers/:last_name/:email", getOneCustomer);
router.post("/api/customers", addCustomer);
router.patch("/api/customers", deActivateCustomers);

router.get("*", (req, res) => {
  sendResponse(
    res,
    404,
    null,
    "This is obviously not what you are looking for."
  );
});

function sendResponse(res, status, data, message = "") {
  return res.status(status).json({
    status,
    data,
    message,
  });
}

module.exports = router;
