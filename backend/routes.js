const router = require("express").Router();
const { getAllSeats } = require("./routeCallbacks");

router.get("/", (req, res) => {
  sendResponse(res, 200, "data respond", "this is the homepage message");
});

router.get("/api/allseats", getAllSeats);

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
