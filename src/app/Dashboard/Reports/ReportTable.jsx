/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-key */
/* eslint-disable no-undef */
/* eslint-disable react/display-name */
"use client";
import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
import Filters from "./Filters";

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

  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      globalFilter: globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: true, //enable row selection for all rows
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
  });

  return (
    <div>
      <HStack justifyContent={"space-between"} pb={"5"}>
        <Input
          w="sm"
          variant="login"
          borderWidth={"1px"}
          borderColor={"#70A0AF"}
          bg="#ECECEC"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
        />
        <HStack>
          <Button
            bgColor={"#DF2935"}
            color={"white"}
            _hover={{ bgColor: "#031926", color: "white" }}
          >
            Delete
          </Button>
          <Button
            bgColor={"#7eb67d"}
            color={"black"}
            _hover={{ bgColor: "#031926", color: "white" }}
          >
            Export
          </Button>
        </HStack>
      </HStack>
      <Box overflowX={"auto"}>
        <Filters
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        <Table variant={"mytable"} color={"black"}>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <div>
        {Object.keys(rowSelection).length} of{" "}
        {table.getPreFilteredRowModel().rows.length} Total Rows Selected
      </div>
    </div>
  );
}
