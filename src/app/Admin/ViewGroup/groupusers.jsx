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
  Text,
  Thead,
  Th,
  Tr,
  Td,
  Box,
  Button,
  Input,
  Select,
  HStack,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";

export default function GroupUsers({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  const emptyArray = [];

  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      globalFilter: globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: true, //enable row selection for all rows
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  return (
    <Box mx={{ base: -4, md: 0 }}>
      <HStack my={2} justify={"space-between"}>
        <Input
          size={"sm"}
          w="xs"
          variant="login"
          borderWidth={"1px"}
          borderColor={"#70A0AF"}
          bg="#ECECEC"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search members..."
        />

        <HStack justify={{ base: "flex-end", lg: "space-evenly" }}>
          <Button
            size={{ base: "sm", md: "md" }}
            bgColor={"#DF2935"}
            color={"white"}
            _hover={{ bgColor: "#031926", color: "white" }}
          >
            Delete
          </Button>
          <Button
            size={{ base: "sm", md: "md" }}
            bgColor={"#7eb67d"}
            color={"black"}
            _hover={{ bgColor: "#031926", color: "white" }}
          >
            Add Member
          </Button>
        </HStack>
      </HStack>

      <Box overflowX={"auto"}>
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
    </Box>
  );
}
