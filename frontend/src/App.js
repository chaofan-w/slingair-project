import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, Paper, Typography, Button, Fade, Snackbar } from "@mui/material";
import Home from "./components/Home";
import Header from "./components/Header";
import Seats from "./components/Seats";
import ProfilePage from "./components/ProfilePage";
import LoginPage from "./components/loginPage";
import OrdersReview from "./components/OrdersReview";
import ReservationContext from "./ReservationContext";

function App() {
  const { displayCheckout, displaySignIn, reservationState, loginStatus } =
    React.useContext(ReservationContext);
  return (
    <Router>
      <Box>
        <Header />
      </Box>
      <Box>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="seats">
            <Route path=":flightnum" element={<Seats />} />
          </Route>
          <Route path="customers">
            <Route path=":last_name/:email" element={<ProfilePage />} />
          </Route>
        </Routes>
        {displayCheckout && <OrdersReview />}
        {!loginStatus && displaySignIn && <LoginPage />}
      </Box>
    </Router>
  );
}

export default App;
