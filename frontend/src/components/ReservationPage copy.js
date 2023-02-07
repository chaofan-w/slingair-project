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
  ListItemIcon,
  IconButton,
  ListItemText,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { Logout, Settings, Comment, Delete } from "@mui/icons-material";
import ReservationContext from "../ReservationContext";

const ReservationPage = () => {
  const { last_name, email } = useParams();
  const [loginUser, setLoginUser] = React.useState(null);
  const { reservationState, reservationDispatch } =
    React.useContext(ReservationContext);
  const [selectedSeats, setSelectedSeats] = React.useState(null);
  const [checked, setChecked] = React.useState([]);

  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value);
    let newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  React.useEffect(() => {
    let ignore = false;
    if (!ignore) {
      fetch(`/api/customers/${last_name}/${email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            console.log(data.data);
            setLoginUser(data.data);
            reservationDispatch({
              type: "get_profile",
              loginStatus: true,
              error: "",
              lastName: last_name,
              loginEmail: email,
              carts: reservationState.carts,
              reservations: data.data.reservations,
              message: "",
            });
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [last_name, email]);

  const selectSeat = async (flight, orderId, seat) => {
    if (!selectedSeats) {
      console.log("no element");
      setSelectedSeats({
        [`${orderId}`]: { [`${flight}`]: [seat] },
      });
      return;
    }

    if (selectedSeats && !Object.keys(selectedSeats).includes(orderId)) {
      setSelectedSeats({
        ...selectedSeats,
        [`${orderId}`]: { [`${flight}`]: [seat] },
      });
      return;
    }

    if (selectedSeats && Object.keys(selectedSeats).includes(orderId)) {
      let currOrder = selectedSeats[orderId];
      let newOrder;
      if (
        Object.keys(currOrder).includes(flight.toUpperCase()) ||
        Object.keys(currOrder).includes(flight.toLowerCase())
      ) {
        newOrder = currOrder[flight].includes(seat)
          ? {
              ...currOrder,
              [flight]: currOrder[flight].filter((seatNum) => seatNum !== seat),
            }
          : { ...currOrder, [flight]: [...currOrder[flight], seat] };
        if (newOrder[flight].length === 0) {
          delete newOrder[flight];
        }
        setSelectedSeats({
          ...selectedSeats,
          [orderId]: { ...newOrder },
        });

        return;
      } else {
        currOrder[flight] = [seat];
        setSelectedSeats({
          ...selectedSeats,
          [orderId]: { ...currOrder },
        });
      }
    }
  };

  const handleCancelReservations = async (e, orderNum) => {
    e.preventDefault();
    const orderId = orderNum;
    const flight = e.currentTarget.value;
    const reservationFlight = reservationState.reservations.find(
      (order) => order._id === orderId
    ).order;
    console.log(reservationFlight);

    const selectAll =
      selectedSeats[orderNum][flight].length ===
      reservationFlight.find(
        (f) => f.flight.toUpperCase() === flight.toUpperCase()
      ).seat.length;

    const seat = selectAll ? "all" : selectedSeats[orderNum][flight];
    await fetch("/api/reservations", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        flight: flight,
        seat: seat,
        orderId: orderId,
      }),
    });

    await fetch("/api/reservations", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    await fetch(
      `/api/customers/${reservationState.lastName}/${reservationState.loginEmail}`
    )
      .then((res) => res.json())
      .then((data) => {
        setLoginUser(data.data);
        reservationDispatch({
          type: "get_profile",
          loginStatus: reservationState.loginStatus,
          error: "",
          lastName: data.data.last_name,
          loginEmail: data.data.email,
          carts: reservationState.carts,
          reservations: data.data.reservations,
          messge: "",
        });
      });

    const newSelectedSeats = { ...selectedSeats };
    delete newSelectedSeats[orderNum][flight];
    setSelectedSeats({ ...newSelectedSeats });
  };

  console.log(selectedSeats);

  return (
    <Box>
      {loginUser && (
        <List>
          <ListSubheader>
            <Typography>Reservations</Typography>
          </ListSubheader>
          {loginUser.reservations &&
            loginUser.reservations
              .filter((item) => item.order.length > 0)
              .map((orderItem) => (
                <ListItem key={orderItem._id}>
                  <Typography>
                    <span style={{ color: "red" }}>Order Id: </span>
                    {orderItem._id}
                  </Typography>
                  {/* </Stack> */}
                  <List>
                    {orderItem.order &&
                      orderItem.order.map((order, index) => (
                        <ListItem key={`order-${index}`}>
                          {/* {selectedSeats &&
                          Object.keys(selectedSeats[orderItem._id]).length >
                            0 &&
                          (selectedSeats[orderItem._id][
                            order.flight.toLowerCase()
                          ] ||
                            selectedSeats[orderItem._id][
                              order.flight.toUpperCase()
                            ]) && ( */}
                          {selectedSeats &&
                            Object.keys(selectedSeats).includes(
                              orderItem._id
                            ) &&
                            Object.keys(selectedSeats[orderItem._id]).includes(
                              order.flight
                            ) && (
                              <Tooltip title="delete selections">
                                <IconButton
                                  key={orderItem._id}
                                  onClick={(e) => {
                                    handleCancelReservations(e, orderItem._id);
                                  }}
                                  value={`${order.flight}`}
                                >
                                  <Delete
                                    sx={{
                                      color: (theme) =>
                                        theme.palette.warning.dark,
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}

                          <Typography>{order.flight}</Typography>
                          {order.seat &&
                            order.seat.map((seat) => {
                              const value = `${order.flight}-${seat}`;
                              const labelId = `checkbox-list-label-${value}`;
                              return (
                                <ListItemButton
                                  role={undefined}
                                  key={value}
                                  onClick={async () => {
                                    handleToggle(value);
                                    await selectSeat(
                                      order.flight,
                                      orderItem._id,
                                      seat
                                    );
                                    // checkEmptyOrder();
                                  }}
                                >
                                  <ListItemIcon>
                                    <Checkbox
                                      edge="start"
                                      checked={checked.indexOf(value) !== -1}
                                      tabIndex={-1}
                                      disableRipple
                                      inputProps={{
                                        "aria-labelledby": labelId,
                                      }}
                                    />
                                    <ListItemText id={labelId} primary={seat} />
                                  </ListItemIcon>
                                </ListItemButton>
                              );
                            })}
                        </ListItem>
                      ))}
                  </List>
                </ListItem>
              ))}
        </List>
      )}
    </Box>
  );
};

export default ReservationPage;
