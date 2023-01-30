import * as React from "react";
import {
  Box,
  Typography,
  Input,
  Button,
  Card,
  Switch,
  Grid,
  MuiLink,
  TextField,
  Divider,
  IconButton,
  Icon,
} from "@mui/material";
import ReservationContext from "../ReservationContext";

const LoginPage = () => {
  const { reservationState, reservationDispatch } =
    React.useContext(ReservationContext);
  const [email, setEmail] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/customers/${lastName}/${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          reservationDispatch({
            type: "get_profile",
            error: "",
            loginEmail: email,
            carts: reservationState.carts,
            reservations: data.data.reservations,
            message: "",
          });
        }
      });
  };
  console.log(reservationState);
  return (
    <Box
      //px for classes that set both padding-left and padding-right
      px={1}
      width="100%"
      height="100vh"
      //mx for classes that set both margin-left and margin-right
      mx="auto"
      position="absolute"
      top={0}
      left={0}
      zIndex={2}
      sx={{
        background: "rgba(241, 163, 138, 0.5)",
        borderRadius: "16px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(5px)",
      }}
    >
      <Box pt={2} pb={3} px={3}>
        <Box component="form" role="form" onSubmit={handleSubmit} noValidate>
          <Box mb={2}>
            <TextField
              type="text"
              label="Last Name"
              variant="outlined"
              value={lastName}
              name="lastName"
              required
              onChange={(e) => {
                e.preventDefault();
                setLastName(e.target.value);
              }}
              fullWidth
            />
          </Box>
          <Box mb={2}>
            <TextField
              type="email"
              label="Email"
              name="email"
              sx={{ color: "darkgrey" }}
              value={email}
              onChange={(e) => {
                e.preventDefault();
                setEmail(e.target.value);
              }}
              required
              fullWidth
            />
          </Box>
          <Box mt={4} mb={1}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={!email || !lastName}
            >
              sign in
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;