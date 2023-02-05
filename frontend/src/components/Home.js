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
  return (
    <Box
      sx={{
        width: "100vw",
        minWidth: 360,
        height: "92vh",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "relative",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "primary.dark",
          position: "absolute",
          top: { xs: "50%", sm: "40%" },
          right: { xs: "20%", sm: 20 },
          fontFamily: "work sans",
        }}
      >
        Home, a fly away from Home
      </Typography>
      <Stack
        direction="row"
        spacing={3}
        sx={{ border: "1px solid white", pt: 5 }}
      >
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
