import * as React from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { Box, Typography, List, ListItem, ListSubheader } from "@mui/material";
import ReservationContext from "../ReservationContext";
import ReservationCard from "./ReservationCard";
import produce from "immer";

const ReservationPage = () => {
  const { last_name, email } = useParams();
  const [loginUser, setLoginUser] = React.useState(null);
  const { reservationState, reservationDispatch, setDisplayAlert } =
    React.useContext(ReservationContext);
  const [selectedSeats, setSelectedSeats] = React.useState({});
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
    // if (!selectedSeats) {
    //   setSelectedSeats(
    //     produce(selectedSeats, (draft) => {
    //       draft.push({ [`${orderId}`]: { [`${flight}`]: [seat] } });
    //     })
    //   );
    //   return;
    // }
    setSelectedSeats(
      produce(selectedSeats, (draft) => {
        if (!Object.keys(draft).includes(orderId)) {
          draft[`${orderId}`] = { [`${flight}`]: [seat] };
          return;
        }

        if (Object.keys(draft).includes(orderId)) {
          let currOrder = draft[orderId];

          if (
            Object.keys(currOrder).includes(flight.toUpperCase()) ||
            Object.keys(currOrder).includes(flight.toLowerCase())
          ) {
            if (
              currOrder[flight].includes(seat) &&
              currOrder[flight].length > 1
            ) {
              currOrder[flight].splice(currOrder[flight].indexOf(seat), 1);
            } else if (
              currOrder[flight].includes(seat) &&
              currOrder[flight].length === 1
            ) {
              delete currOrder[flight];
            } else {
              currOrder[flight].push(seat);
            }
          } else {
            currOrder[`${flight}`] = [seat];
          }
        }
      })
    );
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

    // const newSelectedSeats = { ...selectedSeats };
    // delete newSelectedSeats[orderNum][flight];
    // setSelectedSeats({ ...newSelectedSeats });

    setSelectedSeats(
      produce(selectedSeats, (draft) => {
        delete draft[orderNum][flight];
      })
    );

    setDisplayAlert({ severity: "success", display: true });
  };

  // console.log(selectedSeats);

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
