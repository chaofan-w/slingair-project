import * as React from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { Box, Paper, Typography, Stack, Grid, ButtonBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import ReservationContext from "../ReservationContext";
import { Chair } from "@mui/icons-material";
import produce from "immer";

const SeatsFloorMap = () => {
  const [seats, setSeats] = React.useState(null);
  const { reservationState, reservationDispatch, setDisplayAlert } =
    React.useContext(ReservationContext);
  const { flightnum } = useParams();

  const handleToggleSeats = (e) => {
    const seatId = e.currentTarget.value;
    let currCarts = reservationState.carts;

    const updateCarts = produce(currCarts, (draft) => {
      let flightInCarts = draft.find((order) => order.flight === flightnum);

      if (!flightInCarts) {
        draft.push({ flight: flightnum, seat: [seatId] });
      } else {
        if (flightInCarts.seat.includes(seatId)) {
          flightInCarts["seat"].splice(
            flightInCarts["seat"].indexOf(seatId),
            1
          );
        } else {
          flightInCarts.seat.push(seatId);
        }
      }
    });

    return reservationDispatch({
      type: "select_seats",
      error: "",
      carts: updateCarts.filter((order) => order.seat.length > 0),
      message: "",
    });
  };

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
          // const sortedSeats = seats.sort((a, b) =>
          //   a._id.localeCompare(b._id, "en", {
          //     sensitivity: "base",
          //     numeric: true,
          //   })
          // );
          setSeats(
            produce(seats, (draft) => {
              draft.sort((a, b) =>
                a._id.localeCompare(b._id, "en", {
                  sensitivity: "base",
                  numeric: true,
                })
              );
            })
          );
        });
    }
    return () => {
      ignore = true;
    };
  }, [flightnum]);

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

  const rows = Array.from({ length: 10 }, (value, index) => index + 1);

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 360,
      }}
    >
      <Paper
        elevation={0}
        variant={"outlined"}
        component={"div"}
        sx={{
          width: "100%",
          height: "92vh",
          overflow: "auto",
          // minHeight: 480,
          bgcolor: (theme) => theme.palette.secondary.light,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={"medium"}
          sx={{ color: "primary.select", m: 2 }}
        >{`Flight: ${flightnum.toUpperCase()}`}</Typography>
        <Stack
          width={{ xs: 460, sm: 580, md: 820 }}
          direction={"row"}
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
          sx={{
            mx: "auto",
            gap: 2,
            // border: "1px solid red",
          }}
        >
          <Grid
            container
            width={100}
            sx={{
              rowGap: { xs: 1, sm: 1.5, md: 4 },
              columnGap: 1,
              mx: "auto",
              my: 2,
              // border: "1px solid red",
            }}
          >
            {rows &&
              rows.map((row, index) => (
                <Grid
                  key={"row-" + row}
                  item={true}
                  xs={12}
                  height={{ xs: 40, sm: 60, md: 70 }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={"medium"}
                    sx={{
                      width: "100%",
                      textAlign: "right",
                    }}
                  >
                    {"Row - " + row}
                  </Typography>
                </Grid>
              ))}
          </Grid>
          <Grid
            container
            width={{ xs: 360, sm: 480, md: 720 }}
            sx={{
              rowGap: { xs: 1, sm: 1.5, md: 4 },
              // border: "1px solid red",
              columnGap: 1,
              mx: "auto",
              my: 2,
            }}
          >
            {seats &&
              seats.map((seat, index) => (
                <Grid
                  item={true}
                  xs={1.6}
                  height={{ xs: 40, sm: 60, md: 70 }}
                  key={`${flightnum}-${seat._id}`}
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
                      // key={`${flightnum}-${seat._id}`}
                      disabled={seat.isAvailable ? false : true}
                      onClick={async (e) => {
                        if (reservationState.loginStatus) {
                          handleToggleSeats(e);
                        } else {
                          await reservationDispatch({
                            type: "throwMessage",
                            message: "Please login to book seats",
                          });
                          setDisplayAlert({
                            severity: "info",
                            display: true,
                          });
                        }
                      }}
                      value={seat._id}
                      sx={{
                        p: 0,
                        // border: "1px solid yellow",
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={"medium"}
                        sx={{
                          width: { xs: 40, sm: 50, md: 60 },
                          position: "absolute",
                          top: "30%",
                          left: "50%",
                          transform: "translate(-50%,-50%)",
                          zIndex: 10,
                          color: (theme) =>
                            reservationState.carts.find(
                              (order) =>
                                order.flight === flightnum &&
                                order.seat.includes(seat._id)
                            )
                              ? theme.palette.common.white
                              : theme.palette.primary.contrastText,
                        }}
                      >
                        {seat._id}
                      </Typography>
                      <Chair
                        sx={{
                          width: { xs: 40, sm: 50, md: 60 },
                          height: { xs: 40, sm: 50, md: 60 },
                          color: (theme) => {
                            if (
                              reservationState.carts.find(
                                (order) =>
                                  order.flight === flightnum &&
                                  order.seat.includes(seat._id)
                              )
                            ) {
                              return theme.palette.primary.select;
                            } else {
                              if (seat.isAvailable) {
                                return theme.palette.primary.dark;
                              } else {
                                return theme.palette.grey[400];
                              }
                            }
                          },
                        }}
                      />
                    </ButtonBase>
                  </Item>
                </Grid>
              ))}
          </Grid>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SeatsFloorMap;
