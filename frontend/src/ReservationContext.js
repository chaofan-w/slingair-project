import * as React from "react";

const ReservationContext = React.createContext(null);
export default ReservationContext;

export const ReservationContextProvider = ({ children }) => {
  const [displayCheckout, setDisplayCheckout] = React.useState(false);
  // const [loginStatus, setLoginStatus] = React.useState(false);
  const initialState = JSON.parse(
    window.localStorage.getItem("reservationState")
  ) || {
    loginStatus: false,
    error: "",
    lastName: "",
    loginEmail: "",
    carts: [],
    reservations: [],
    message: "",
  };

  const [displayAlert, setDisplayAlert] = React.useState({
    serverity: "",
    display: false,
  });
  const [displaySignIn, setDisplaySignIn] = React.useState(false);
  const [displaySignUp, setDisplaySignUp] = React.useState(false);

  const [reservationState, reservationDispatch] = React.useReducer(
    reservationReducer,
    initialState
  );

  function reservationReducer(reservationState, action) {
    switch (action.type) {
      case "get_profile": {
        return {
          loginStatus: action.loginStatus,
          error: action.error,
          lastName: action.lastName,
          loginEmail: action.loginEmail,
          carts: action.carts,
          reservations: action.reservations,
          message: action.message,
        };
      }
      case "select_seats": {
        return {
          loginStatus: reservationState.loginStatus,
          error: action.error,
          lastName: reservationState.lastName,
          loginEmail: reservationState.loginEmail,
          carts: action.carts,
          reservations: reservationState.reservations,
          message: action.message,
        };
      }
      case "get_state_from_localstorage": {
        return {
          loginStatus: action.loginStatus,
          error: action.error,
          lastName: action.lastName,
          loginEmail: action.loginEmail,
          carts: action.carts,
          reservations: action.reservations,
          message: action.message,
        };
      }
      case "logout": {
        return {
          ...reservationState,
          loginStatus: false,
        };
      }
      default: {
        return reservationState;
      }
    }
  }

  // https://blog.bitsrc.io/5-methods-to-persisting-state-between-page-reloads-in-react-8fc9abd3fa2f

  // use localStorage to persisting reservationState when switch between different pages, and page reload
  // to use useEffect whenever state change, to store it to localstorage, need to change the initialState, if localStorage exists, the initial state is the localStorage state, if not, use the empty initialstate

  React.useEffect(() => {
    window.localStorage.setItem(
      "reservationState",
      JSON.stringify(reservationState)
    );
    console.log("localStorage updated");
  }, [reservationState]);

  return (
    <ReservationContext.Provider
      value={{
        reservationState,
        reservationDispatch,
        displayAlert,
        setDisplayAlert,
        displaySignUp,
        setDisplaySignUp,
        setDisplaySignIn,
        displaySignIn,
        displayCheckout,
        setDisplayCheckout,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
