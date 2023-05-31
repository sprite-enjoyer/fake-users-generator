import { CSS, Table, Text } from "@nextui-org/react";
import { CSSProperties } from "react";
import { FilterStateType, GeneratedPersonData } from "../misc/types";
import { v4 } from "uuid";
import { useAsyncList } from "@nextui-org/react";

const tableCss: CSS = { overflow: "auto", height: "700px" };
const mainDivStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  paddingBottom: "50px",
  height: "80%",
  overflow: "auto",
};

export interface DataTableProps {
  state: FilterStateType
}

const DataTable = ({ state }: DataTableProps) => {
  console.log("rerender!")

  const list = useAsyncList<GeneratedPersonData>({
    async load({ signal, cursor }) {
      const url = cursor || `${import.meta.env.VITE_SERVER_URL}/getRandomUsers`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: signal,
        body: JSON.stringify(state),
      })
        .then(async res => await res.json())
        .catch(err => console.error(err)) as { message: string, data: GeneratedPersonData[] };
      return {
        items: response.data.map((data, i) => { return { ...data, index: i } }),
        cursor: url,
      };
    }
  });

  return (
    <div style={mainDivStyle}>
      <Table css={tableCss}>
        <Table.Header>
          <Table.Column>
            <Text>
              Index
            </Text>
          </Table.Column>
          <Table.Column>
            <Text>
              Name
            </Text>
          </Table.Column>
          <Table.Column>
            <Text>
              Address
            </Text>
          </Table.Column>
          <Table.Column>
            <Text>
              Phone
            </Text>
          </Table.Column>
        </Table.Header>
        <Table.Body
          items={list.items}
          loadingState={list.loadingState}
          onLoadMore={list.loadMore}
          css={{}}
        >
          {(item) =>
            <Table.Row key={v4()}>
              <Table.Cell><Text>{0}</Text></Table.Cell>
              <Table.Cell><Text>{item.fullName}</Text></Table.Cell>
              <Table.Cell><Text>{item.fullAddress}</Text></Table.Cell>
              <Table.Cell><Text>{item.phone}</Text></Table.Cell>
            </Table.Row>
          }
        </Table.Body>
      </Table>
    </div >
  );
};

export default DataTable;