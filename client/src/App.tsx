import { Container, Loading, CSS } from "@nextui-org/react";
import DataTable from "./components/DataTable";
import Filters from "./components/Filters";
import { createContext, useEffect, useReducer, useState } from "react";
import { FilterStateType, DispatchFilterActionType } from "./misc/types";

const containerCss: CSS = {
  gap: "20px",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  position: "absolute",
  top: "0",
  left: "0",
  height: "100vh",
  padding: "5% 100px 0 100px",
};

const filterChangeReducer = (state: FilterStateType, action: DispatchFilterActionType) => {
  const newState = { ...state };
  const { seed, country, errorNumber } = action.payload;

  if (country?.toString()) newState.country = country;
  if (
    !isNaN(errorNumber ?? NaN) &&
    errorNumber !== undefined &&
    errorNumber > -1 &&
    errorNumber <= 1000
  ) newState.errorNumber = errorNumber;

  if (seed?.toString()) newState.seed = seed;

  if (!newState.seed) newState.seed = 0;
  if (!newState.errorNumber || isNaN(errorNumber ?? NaN)) newState.errorNumber = 0;
  if (!newState.country) newState.country = "Britain";

  return newState;
};

export const ResetStatusContext = createContext(false);

const App = () => {
  const [filterState, dispatchFilterChange] =
    useReducer(filterChangeReducer, { country: "Britain", seed: 1, errorNumber: 0 });
  const [resetStatus, setResetStatus] = useState(false);

  useEffect(() => {
    const resetData = async () =>
      await fetch(`${import.meta.env.VITE_SERVER_URL}/reset`, { keepalive: true, method: "GET" })
        .then(async res => await res.json())
        .catch(e => console.error(e)) as Promise<{ message: string }>;
    resetData().then(res => setResetStatus(!!res.message));
  }, []);

  if (!resetStatus) return (
    <Container
      css={{ ...containerCss, justifyContent: "center", alignItems: "center" }}
    >
      <Loading size="lg" />
    </Container>
  );

  return (
    <ResetStatusContext.Provider value={resetStatus}>
      <Container css={containerCss}
      >
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
    </ResetStatusContext.Provider>
  );
};

export default App;