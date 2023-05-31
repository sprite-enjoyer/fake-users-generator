import { CSS, Container } from "@nextui-org/react";
import DataTable from "./components/DataTable";
import Filters from "./components/Filters";
import { useEffect, useReducer } from "react";
import { FilterStateType, DispatchFilterActionType } from "./misc/types";
import { io } from "socket.io-client";

const baseContainerCss: CSS = {
  gap: "20px",
  width: "100vw",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: "0",
  left: "0",
  height: "100vh",
  padding: "5% 100px 0 100px",
};

const filterChangeReducer = (state: FilterStateType, action: DispatchFilterActionType) => {
  const newState = { ...state };
  const { seed, country, errorNumber } = action.payload;

  if (country) newState.country = country;
  if (errorNumber) newState.errorNumber = errorNumber;
  if (seed) newState.seed = seed;

  return newState;
};

const App = () => {
  const [filterState, dispatchFilterChange] =
    useReducer(filterChangeReducer, { country: "Britain", seed: 0, errorNumber: 0 });

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URL);

    socket.on('connect', () => {
      console.log('Connected to the server.');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server.');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container css={baseContainerCss}>
      <div style={{ flex: "1 1", height: "100%" }}>
        <Filters
          filterState={filterState}
          dispatchFilterChange={dispatchFilterChange}
        />
      </div>

      <div style={{ flex: "6 6", height: "100%", overflow: "auto" }}>
        <DataTable state={filterState} />
      </div>
    </Container>
  );
};

export default App;