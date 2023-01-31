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
  IconButton,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import ReservationContext from "../ReservationContext";
const Header = () => {
  const { reservationState, reservationDispatch } =
    React.useContext(ReservationContext);

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
        <IconButton>
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
           useing the reduce, the accumulated/prev value should be set as the value itself, not the as an element. here prev is the accumulation of all seatArr length, it starts with 0, initial value is 0. from initial value one, the reduce will accumulate the value by 0 + first obj.seatArr.length; then plus 2nd obj.seatArr.length
           if the element itself is the value, then use pre, curr e.g., (pre, curr)=>pre+curr
           if need futher action to get the value from element, use accumulator, currentValue, e.g., (accumulator, currentValue)=> [...accumulator, ...currentValue.seatArr],[]
          
          */}
          {reservationState.carts.reduce(
            (accumulator, curr) => accumulator + curr.seatArr.length,
            0
          )}
        </Typography>
      </Box>
    </Stack>
  );
};

export default Header;
