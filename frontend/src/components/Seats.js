import * as React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Fade,
  Snackbar,
  Stack,
  List,
  ListItem,
  ListSubheader,
  ListItemButton,
} from "@mui/material";
import ReservationContext from "../ReservationContext";

const Seats = () => {
  const [seats, setSeats] = React.useState(null);
  const { reservationState, reservationDispatch } =
    React.useContext(ReservationContext);
  const { flightnum } = useParams();

  const handleToggleSeats = (e) => {
    const seatId = e.currentTarget.value;
    let currCarts = reservationState.carts;
    let flightInCarts = currCarts.find((order) => order.flight === flightnum);
    console.log(flightInCarts);
    if (!flightInCarts) {
      currCarts.push({ flight: flightnum, seat: [seatId] });
    } else {
      console.log(flightInCarts);
      currCarts = currCarts.map((order) => {
        if (order.flight === flightnum) {
          if (order.seat.includes(seatId)) {
            const updateseat = order.seat.filter((i) => i !== seatId);
            return { ...order, seat: updateseat };
          } else {
            order.seat.push(seatId);
            return order;
          }
        } else {
          return order;
        }
      });
    }

    return reservationDispatch({
      type: "select_seats",
      error: "",
      carts: currCarts.filter((order) => order.seat.length > 0),
      message: "",
    });
  };

  console.log(reservationState);

  React.useEffect(() => {
    let ignore = false;
    if (!ignore) {
      fetch(`/api/seats/${flightnum}`)
        .then((res) => res.json())
        .then((data) => {
          const { flightNum, seats } = data.data;
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
          // sort array of string with mix of numbers, makes sure follow 1, 2, 3, number order, rather than 1, 10, 100, 2, 20, 3...
          //By passing the numeric: true option, it will smartly recognize numbers in the string. You can do case-insensitive using sensitivity: 'base'.
          const sortedSeats = seats.sort((a, b) =>
            a._id.localeCompare(b._id, "en", {
              sensitivity: "base",
              numeric: true,
            })
          );
          setSeats(sortedSeats);
        });
    }
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Box>
      <List>
        <ListSubheader>{"Flight: " + flightnum.toUpperCase()}</ListSubheader>
        {seats &&
          seats.map((seat, index) => (
            <Button
              key={`${flightnum}-${seat._id}`}
              disabled={seat.isAvailable ? false : true}
              onClick={(e) => {
                reservationState.loginStatus && handleToggleSeats(e);
              }}
              value={seat._id}
              sx={{
                color: reservationState.carts.find(
                  (order) =>
                    order.flight === flightnum && order.seat.includes(seat._id)
                )
                  ? "red"
                  : (theme) => theme.palette.primary.main,
              }}
            >
              <Typography>{seat._id}</Typography>
              {" --- "}
              <Typography>
                {`${seat.isAvailable ? "available" : "booked"}`}
              </Typography>
            </Button>
          ))}
      </List>
    </Box>
  );
};

export default Seats;
