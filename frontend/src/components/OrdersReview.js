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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Icon,
  ListItemButton,
  Stack,
} from "@mui/material";
import * as React from "react";
import ReservationContext from "../ReservationContext";
import { Link, useNavigate } from "react-router-dom";

const OrdersReview = () => {
  const navigate = useNavigate();
  const { reservationState, reservationDispatch, setDisplayCheckout } =
    React.useContext(ReservationContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: reservationState.loginEmail,
        order: reservationState.carts,
      }),
    };
    await fetch("/api/reservations", option);
    // await reservationState.carts.forEach(async (flight) => {
    //   console.log(flight.flight);
    //   await fetch("/api/seats", {
    //     method: "PATCH",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //     },
    //     body: JSON.stringify({ flightNum: flight.flight }),
    //   });
    // });
    await fetch(
      `/api/customers/${reservationState.lastName}/${reservationState.loginEmail}`
    )
      .then((res) => res.json())
      .then((data) => {
        reservationDispatch({
          type: "get_profile",
          loginStatus: reservationState.loginStatus,
          error: "",
          lastName: data.data.last_name,
          loginEmail: data.data.email,
          carts: [],
          reservations: data.data.reservations,
          messge: "",
        });
      });
    setDisplayCheckout(false);
    navigate("/");
  };
  return (
    <>
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
        {reservationState &&
          reservationState.carts.map((order) => (
            <Stack key={`${order.flight}`}>
              <Typography>{order.flight}</Typography>
              {order.seat &&
                order.seat.map((seat) => (
                  <ListItemButton>{seat}</ListItemButton>
                ))}
            </Stack>
          ))}
        <Box mt={4} mb={1}>
          <Button variant="contained" onClick={handleSubmit} fullWidth>
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default OrdersReview;
