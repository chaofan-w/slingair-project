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
  Menu,
  MenuItem,
} from "@mui/material";
import ReservationContext from "../ReservationContext";
import LoginPage from "./loginPage";
const Home = () => {
  const { reservationState, reservationDispatch, loginStatus, displaySignIn } =
    React.useContext(ReservationContext);

  // const navigate = useNavigate();
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
        variant={"h6"}
        sx={{
          maxWidth: 500,
          minWidth: 300,
          color: "common.black",
          position: "absolute",
          top: { xs: "50%", sm: "40%" },
          right: { xs: "50%", sm: 20 },
          fontFamily: "work sans",
          transform: { xs: "translateX(50%)", sm: "translateX(0)" },
        }}
      >
        Discover the world, one flight at a time.
      </Typography>
      <Stack
        direction="row"
        spacing={3}
        justifyContent={"center"}
        sx={{
          width: "100%",
          // border: "1px solid white",
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {!loginStatus && displaySignIn && (
          <Paper
            elevation={1}
            sx={{
              minWidth: "40%",
              background: "rgba(255, 255, 255, 0.07)",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(11.9px)",
              border: "1px solid rgba(255, 255, 255, 0.02)",
            }}
          >
            <LoginPage />
          </Paper>
        )}
      </Stack>
    </Box>
  );
};

export default Home;
