import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Fade,
  Snackbar,
  Stack,
  IconButton,
  Icon,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import ReservationContext from "../ReservationContext";
import { SupervisedUserCircle, Login } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  const {
    reservationState,
    reservationDispatch,
    displayCheckout,
    setDisplayCheckout,
    setDisplaySignIn,
  } = React.useContext(ReservationContext);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ pr: 5 }}
    >
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
      <Box display="block" position="relative">
        <IconButton
          disabled={
            reservationState.carts.reduce(
              (accumulator, curr) => accumulator + curr.seat.length,
              0
            ) === 0
          }
          onClick={() => setDisplayCheckout(!displayCheckout)}
        >
          <ShoppingCart />
        </IconButton>
        <Typography
          sx={{
            width: 18,
            height: 18,
            lineHeight: 1.5,
            fontSize: 12,
            textAlign: "center",
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: (theme) => theme.palette.primary.main,
            borderRadius: "50%",
            color: "white",
          }}
        >
          {/* 
           useing the reduce, the accumulated/prev value should be set as the value itself, not the as an element. here prev is the accumulation of all seatA length, it starts with 0, initial value is 0. from initial value one, the reduce will accumulate the value by 0 + first obj.seat.length; then plus 2nd obj.seat.length
           if the element itself is the value, then use pre, curr e.g., (pre, curr)=>pre+curr
           if need futher action to get the value from element, use accumulator, currentValue, e.g., (accumulator, currentValue)=> [...accumulator, ...currentValue.seat],[]
          
          */}
          {reservationState.carts.reduce(
            (accumulator, curr) => accumulator + curr.seat.length,
            0
          )}
        </Typography>
      </Box>
      {reservationState.loginStatus ? (
        <Button
          id="logoutBtn"
          variant="text"
          onClick={async (e) => {
            e.preventDefault();
            await reservationDispatch({
              type: "get_profile",
              loginStatus: false,
              error: "",
              lastName: "",
              loginEmail: "",
              carts: [],
              reservations: [],
              message: "",
            });

            // window.localStorage.setItem(
            //   "reservationState",
            //   JSON.stringify({
            //     loginStatus: false,
            //     error: "",
            //     lastName: "",
            //     loginEmail: "",
            //     carts: [],
            //     reservations: [],
            //     message: "",
            //   })
            // );
            await setDisplaySignIn(false);
            navigate("/");
          }}
        >
          Logout
        </Button>
      ) : (
        <IconButton
          onClick={() => {
            setDisplaySignIn(true);
          }}
        >
          <Typography variant="h6" sx={{ mr: 2, color: "primary.main" }}>
            Login
          </Typography>
          <Icon>
            <Login sx={{ color: "primary.main" }} />
          </Icon>
        </IconButton>
      )}
    </Stack>
  );
};

export default Header;
