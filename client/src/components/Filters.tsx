import { Button, CSS, Card, Dropdown, FormElement, Input, Text } from "@nextui-org/react"
import { Dispatch, KeyboardEventHandler, useState } from "react";
import { DispatchFilterActionType, FilterStateType } from "../misc/types";

const textCss: CSS = { width: "100%", fontSize: "1.5em", fontWeight: "400", fontFamily: "inherit" };
const buttonCss: CSS = {
  backgroundColor: "transparent",
  color: "Black",
  fontWeight: "400",
  display: "flex",
  justifyContent: "flex-start",
  width: "100%"
};

const bigButtonCss: CSS = {
  ...buttonCss,
  backgroundColor: "$green600",
  color: "white",
  fontSize: "1.3em",
  width: "100%",
  fontWeight: "500",
  display: "flex",
  justifyContent: "center",

};
const cardCss: CSS = {
  all: "unset",
  width: "100%",
  height: "auto",
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: "10px",
};

export interface FiltersProps {
  filterState: FilterStateType,
  dispatchFilterChange: Dispatch<DispatchFilterActionType>,
}

const Filters = ({ filterState, dispatchFilterChange }: FiltersProps) => {
  const [errorNumber, setErrorNumber] = useState(0);
  const [seed, setSeed] = useState(0);

  return (
    <Card css={cardCss}>
      <Dropdown >
        <Dropdown.Button
          flat
          size={"md"}
          css={bigButtonCss}
        >
          {filterState.country}
        </Dropdown.Button>
        <Dropdown.Menu
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={[filterState.country]}
          aria-label="Choose country"
        >
          <Dropdown.Item key="Britain" textValue="Britain" css={{ width: "100%", padding: "0" }} >
            <Button css={buttonCss} onPress={() => dispatchFilterChange({ payload: { country: "Britain" } })} >
              <Text css={textCss}>
                Britain
              </Text>
            </Button>
          </Dropdown.Item>
          <Dropdown.Item key="Germany" textValue="Germany" css={{ width: "100%", padding: "0" }} >
            <Button css={buttonCss} onPress={() => dispatchFilterChange({ payload: { country: "Germany" } })}>
              <Text css={textCss}>
                Germany
              </Text>
            </Button>
          </Dropdown.Item  >
          <Dropdown.Item key="France" textValue="France" css={{ width: "100%", padding: "0", }} >
            <Button css={buttonCss} onPress={() => dispatchFilterChange({ payload: { country: "France" } })}>
              <Text css={textCss}>
                France
              </Text>
            </Button>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Input
        size="xl"
        labelLeft="Seed"
        type="number"
        aria-label="Seed"
        width="100%"
        value={seed}
        onChange={(e) => { setSeed(parseFloat(e.target.value)); console.log(e.target.value) }}
      />
      <Input
        size="xl"
        labelLeft="Error Number:"
        aria-label="Error number"
        width="100%"
        value={errorNumber * 100}
        type={"number"}
        onChange={(e) => setErrorNumber(parseFloat(e.target.value) / 100)}
      />
      <Input
        min={0}
        initialValue="0"
        max={10}
        onChange={e => setErrorNumber(prev => parseFloat(e.target.value))}
        size="xl"
        labelLeft={errorNumber.toString()}
        width="100%"
        type="range"
        aria-label="Error number"
      />
      <Button
        flat
        size={"lg"}
        css={{ ...bigButtonCss, marginTop: "20px" }}
        onClick={() => dispatchFilterChange({ payload: { seed: seed, errorNumber: errorNumber } })}
      >
        Apply Filters
      </Button>
      <Card css={{
        marginTop: "50px",
        padding: "20px 5px 20px 20px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: "column"
      }} >
        <Text css={{ fontSize: "1.5em" }} >
          Error number: {filterState.errorNumber}
        </Text>
        <Text css={{ fontSize: "1.5em" }}>
          Seed: {filterState.seed}
        </Text>
        <Text css={{ fontSize: "1.5em" }}>
          Country: {filterState.country}
        </Text>
      </Card>
    </Card >
  );
};

export default Filters;