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
  const [openFilter, setOpenFilter] = React.useState(false);

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
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  return (
    <Box mx={{ base: -4, md: 0 }}>
      <Stack
        direction={{ base: "column", lg: "row" }}
        justifyContent={"space-between"}
        pb={"5"}
        spacing={"5"}
      >
        <HStack justify={{ base: "space-between", lg: "space-evenly" }}>
          <Input
            size={{ base: "sm", md: "md" }}
            w={{ base: "50", md: "xs" }}
            variant="login"
            borderWidth={"1px"}
            borderColor={"#70A0AF"}
            bg="#ECECEC"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
          />
          <Button
            size={{ base: "sm", md: "md" }}
            bgColor={"black"}
            color={"white"}
            _hover={{ bgColor: "teal", color: "white" }}
            leftIcon={<Icon as={FiFilter} color="white" />}
            onClick={() => setOpenFilter(!openFilter)}
          >
            Filter
          </Button>
        </HStack>
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
            Export
          </Button>
        </HStack>
      </Stack>
      <Box display={openFilter ? "initial" : "none"}>
        <Filters
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
      </Box>
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
        <Stack
          direction={{ base: "column", lg: "row" }}
          my={"5"}
          spacing={{ base: "5", lg: "10" }}
        >
          <div>
            <Button
              onClick={() => table.setPageIndex(0)}
              isDisabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </Button>
            <Button
              onClick={() => table.previousPage()}
              isDisabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </Button>

            <Button
              onClick={() => table.nextPage()}
              isDisabled={!table.getCanNextPage()}
            >
              {">"}
            </Button>
            <Button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              isDisabled={!table.getCanNextPage()}
            >
              {">>"}
            </Button>
          </div>
          <Stack direction={{ base: "column", md: "row" }}>
            <HStack>
              <Text>Page</Text>
              <div>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
            </HStack>
            <HStack>
              <Text>| Go to page:</Text>
              <Input
                size={"sm"}
                variant="login"
                w={"16"}
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
              />
            </HStack>
            <HStack>
              <Select
                variant="trim"
                size={"sm"}
                w={"32"}
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 15, 25, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </Select>
            </HStack>
          </Stack>
        </Stack>
        {Object.keys(rowSelection).length} of{" "}
        {table.getPreFilteredRowModel().rows.length} Total Rows Selected
      </div>
    </Box>
  );
}
