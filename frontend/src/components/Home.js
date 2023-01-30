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
const Home = () => {
  const { reservationState, reservationDispatch } =
    React.useContext(ReservationContext);
  console.log(reservationState);
  return (
    <Box sx={{ my: 5 }}>
      <Stack direction="row" spacing={3}>
        <Button variant="contained" href="/seats/sa231">
          SA231
        </Button>
        <Button variant="contained" href="/seats/sa232">
          SA232
        </Button>
        <Button variant="contained" href="/seats/sa233">
          SA233
        </Button>
      </Stack>
    </Box>
  );
};

export default Home;
