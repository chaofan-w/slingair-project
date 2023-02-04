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
  IconButton,
  Grid,
  ButtonBase,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ReservationContext from "../ReservationContext";
import { Chair } from "@mui/icons-material";

const SeatsFloorMap = () => {
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
      carts: currCarts,
      message: "",
    });
  };

  // console.log(reservationState);

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

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.primary.light
        : theme.palette.primary.dark,
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <Box width={"100%"} height={"100%"} minWidth={360}>
      <Paper
        elevation={1}
        sx={{
          width: "100%",
          height: "100%",
          minHeight: 480,
        }}
      >
        <Grid
          container
          width={{ xs: 360, sm: 480, md: 720 }}
          sx={{
            // border: "2px solid black",
            rowGap: { xs: 1, sm: 2, md: 4 },
            columnGap: 1,
            mx: "auto",
          }}
        >
          {seats &&
            seats.map((seat, index) => (
              <Grid
                xs={1.6}
                height={{ xs: 50, sm: 60, md: 70 }}
                sx={{
                  // border: "1px solid red",
                  position: "relative",
                  ml: () => (index % 6 === 3 ? { xs: 3, sm: 4, md: 5 } : 0),
                }}
              >
                <Item
                  sx={{
                    // border: "1px solid red",
                    position: "relative",
                    p: { xs: 0, sm: 1, md: 2 },
                  }}
                >
                  <ButtonBase
                    height={{ xs: 40, sm: 50, md: 60 }}
                    width={{ xs: 40, sm: 50, md: 60 }}
                    sx={{
                      p: 0,
                      // border: "1px solid yellow",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        zIndex: 10,
                      }}
                    >
                      {seat._id}
                    </Typography>
                    <Chair
                      sx={{
                        width: { xs: 40, sm: 50, md: 60 },
                        height: { xs: 40, sm: 50, md: 60 },
                        color: (theme) => theme.palette.primary.dark,
                      }}
                    />
                  </ButtonBase>
                </Item>
              </Grid>
            ))}
        </Grid>
      </Paper>
      {/* <List>
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
          
      </List> */}
    </Box>
  );
};

export default SeatsFloorMap;
