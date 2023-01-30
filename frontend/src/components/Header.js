import * as React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Fade,
  Snackbar,
  Stack,
} from "@mui/material";
import ReservationContext from "../ReservationContext";
const Header = () => {
  const { reservationState, reservationDispatch } =
    React.useContext(ReservationContext);
  return (
    <Box>
      <Button
        variant="outlined"
        href="/"
        // onClick={() => {
        //   window.localStorage.setItem(
        //     "reservationState",
        //     JSON.stringify(reservationState)
        //   );
        // }}
      >
        Home
      </Button>
    </Box>
  );
};

export default Header;
