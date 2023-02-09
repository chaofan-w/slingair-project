import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, Paper, Typography, Button, Fade, Snackbar } from "@mui/material";
import Home from "./components/Home";
import Header from "./components/Header";
import Seats from "./components/Seats";
import ProfilePage from "./components/ProfilePage";
import LoginPage from "./components/loginPage";
import OrdersReview from "./components/CartPage";
import ReservationContext from "./ReservationContext";
import ReservationPage from "./components/ReservationPage";
import CartPage from "./components/CartPage";
import SeatsFloorMap from "./components/SeatsFloorMap";
import GlobalStyles from "./GlobalStyles";
import SignUpForm from "./components/SignUpForm";

function App() {
  const { displayCheckout, displaySignIn, reservationState, loginStatus } =
    React.useContext(ReservationContext);
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
        </Route>
        <Route path="carts" element={<CartPage />} />
      </Routes>

      {/* {displayCheckout && <OrdersReview />} */}
    </Router>
  );
}

export default App;
