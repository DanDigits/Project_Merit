/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-key */
/* eslint-disable no-undef */
/* eslint-disable react/display-name */
"use client";
import React from "react";
import {
  useTable,
  useRowSelect,
  useGlobalFilter,
  useFilters,
} from "react-table";
import {
  Table,
  Tbody,
  Thead,
  Th,
  Tr,
  Td,
  Box,
  Button,
  Input,
  Flex,
  HStack,
} from "@chakra-ui/react";
import NextLink from "next/link";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;
    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);
    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

export default function ReportTable({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  const emptyArray = [];

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
    {
      data: data || emptyArray,
      columns,
    },
    useGlobalFilter,
    useFilters,
    useRowSelect,
    (hooks) => {
      hooks.columns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );
  const handleSearchInputChange = (e) => {
    const { value } = e.currentTarget;
    setGlobalFilter(value);
  };
  // Render the UI for your table
  return (
    <>
      <HStack justifyContent={"space-between"} pb={"5"}>
        <Input
          w="sm"
          variant="login"
          borderWidth={"1px"}
          borderColor={"#70A0AF"}
          bg="#ECECEC"
          placeholder="Search"
          onChange={handleSearchInputChange}
        />
        <NextLink
          href={{ pathname: "/export", query: selectedRowIds }}
          passHref
        >
          <Button
            isDisabled
            bgColor={"#70A0AF"}
            color={"white"}
            _hover={{ bgColor: "#706993", color: "white" }}
          >
            Export
          </Button>
        </NextLink>
      </HStack>
      <Box overflowX={"auto"}>
        <Table variant={"striped"} bgColor="#70A0AF" {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps()}>
                    <Flex align={"center"} gap={"10px"}>
                      <Box as="span"> {column.render("Header")} </Box>
                      {column.isSorted && (
                        <Box as="span">
                          {column.isSortedDesc ? (
                            <ArrowDownIcon boxSize={3} ml={2} />
                          ) : (
                            <ArrowUpIcon boxSize={3} ml={2} />
                          )}
                        </Box>
                      )}
                      <Box ml={2} as="span">
                        {column?.canFilter ? column.render("Filter") : null}
                      </Box>
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.slice(0, 10).map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      <Box display={"none"}>
        <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
        <pre>
          <code>
            {JSON.stringify(
              {
                selectedRowIds: selectedRowIds,
                "selectedFlatRows[].original": selectedFlatRows.map(
                  (d) => d.original
                ),
              },
              null,
              2
            )}
          </code>
        </pre>
      </Box>
    </>
  );
}
