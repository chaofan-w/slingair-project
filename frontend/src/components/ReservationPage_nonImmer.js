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
import ReservationCard from "./ReservationCard";

const ReservationPage = () => {
  const { last_name, email } = useParams();
  const [loginUser, setLoginUser] = React.useState(null);
  const { reservationState, reservationDispatch, setDisplayAlert } =
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
    const reservationFlight = reservationState.reservations.find(
      (order) => order._id === orderId
    ).order;
    console.log(reservationFlight);

    let reservedFlightSeatTotal = reservationFlight.reduce(
      (prev, curr) => prev + curr.seat.length,
      0
    );

    let selectedFlightSeatTotal = Object.values(
      selectedSeats[`${orderId}`]
    ).reduce((prev, curr) => prev + curr.length, 0);

    const selectAllFlights =
      reservedFlightSeatTotal === selectedFlightSeatTotal;

    console.log(
      `reservedTotal: ${reservedFlightSeatTotal}, selectedTotal: ${selectedFlightSeatTotal}`
    );

    const flight = selectAllFlights ? "all" : e.currentTarget.value;
    let seat;
    if (flight === "all") {
      seat = "all";
    } else {
      const reservationFlight = reservationState.reservations.find(
        (order) => order._id === orderId
      ).order;
      const selectAll =
        selectedSeats[orderNum][flight].length ===
        reservationFlight.find(
          (f) => f.flight.toUpperCase() === flight.toUpperCase()
        ).seat.length;

      seat = selectAll ? "all" : selectedSeats[orderNum][flight];
    }

    let throwedMsg = "";
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
    })
      .then((res) => res.json())
      .then((data) => {
        throwedMsg = data.message;
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
          message: throwedMsg,
        });
      });

    const newSelectedSeats = { ...selectedSeats };
    delete newSelectedSeats[orderNum][flight];
    setSelectedSeats({ ...newSelectedSeats });

    setDisplayAlert({ severity: "success", display: true });
  };

  console.log(selectedSeats);

  return (
    <Box>
      {loginUser && (
        <List>
          <ListSubheader>
            <Typography variant="h5">Reservations</Typography>
          </ListSubheader>
          {loginUser.reservations &&
            loginUser.reservations
              .filter((item) => item.order.length > 0)
              .map((orderItem) => (
                <ListItem key={orderItem._id}>
                  <ReservationCard
                    orderItem={orderItem}
                    selectSeat={selectSeat}
                    handleCancelReservations={handleCancelReservations}
                    handleToggle={handleToggle}
                    checked={checked}
                    setChecked={setChecked}
                    selectedSeats={selectedSeats}
                  />
                </ListItem>
              ))}
        </List>
      )}
    </Box>
  );
};

export default ReservationPage;
