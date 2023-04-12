import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Snackbar } from "@mui/material";
import Home from "./components/Home";
import Header from "./components/Header";
import ProfilePage from "./components/ProfilePage";
import LoginPage from "./components/loginPage";
import ReservationContext from "./ReservationContext";
import ReservationPage from "./components/ReservationPage";
import CartPage from "./components/CartPage";
import SeatsFloorMap from "./components/SeatsFloorMap";
import GlobalStyles from "./GlobalStyles";
import SignUpForm from "./components/SignUpForm";
import MuiAlert from "@mui/material/Alert";

function App() {
  const {
    displayAlert,
    setDisplayAlert,
    reservationState,
    reservationDispatch,
    loginStatus,
  } = React.useContext(ReservationContext);
  // console.log(reservationState);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return (
      <MuiAlert
        elevation={6}
        ref={ref}
        variant="filled"
        sx={{ zIndex: 10, width: "50%", minWidth: 360 }}
        {...props}
      />
    );
  });

  return (
    <Router>
      <GlobalStyles />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="seats">
          <Route path=":flightnum" element={<SeatsFloorMap />} />
          {/* <Route path=":flightnum" element={<Seats />} /> */}
        </Route>
        <Route path="customers">
          <Route path=":last_name/:email" element={<ProfilePage />} />
          <Route
            path="reservations/:last_name/:email"
            element={<ReservationPage />}
          />
          <Route path="signup" element={<SignUpForm />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="carts" element={<CartPage />} />
      </Routes>
      {displayAlert && (
        <Snackbar
          open={displayAlert.display}
          autoHideDuration={3000}
          onClose={(e, reason) => {
            if (reason === "clickaway") {
              return;
            }
            setDisplayAlert({ severity: "info", display: false });
            reservationDispatch({
              type: "clearMessage",
            });
          }}
          sx={{ width: "50%", color: (theme) => theme.palette.white }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Alert
            variant="filled"
            severity={displayAlert.severity}
            onClose={(e, reason) => {
              if (reason === "clickaway") {
                return;
              }
              setDisplayAlert({
                severity: displayAlert.severity,
                display: false,
              });
              reservationDispatch({
                type: "throwMessage",
                message: "",
              });
            }}
            sx={{
              width: "100%",
              color: (theme) => theme.palette.white,
            }}
          >
            {reservationState.message}
          </Alert>
        </Snackbar>
      )}
    </Router>
  );
}

export default App;
