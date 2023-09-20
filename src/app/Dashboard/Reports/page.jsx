"use client";

import * as React from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import SelectColumnFilter from "./SelectColumnFilter";
import ReportTable from "./ReportTable";

const data = [
  {
    quarter: 2,
    date: "2023 Apr 12",
    title: "This is a title",
    view: "o",
  },
  {
    quarter: 2,
    date: "2023 May 30",
    title: "This is a title",
    view: "o",
  },
  {
    quarter: 2,
    date: "2023 Jun 5",
    title: "This is a title",
    view: "o",
  },
  {
    quarter: 3,
    date: "2023 Aug 23",
    title: "This is a title",
    view: "o",
  },
  {
    quarter: 1,
    date: "2023 Feb 18",
    title: "This is a title",
    view: "o",
  },
];

function IndeterminateCheckbox({ indeterminate, className = "", ...rest }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}

export default function Page() {
  const columns = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "quarter",
        header: () => "Quarter",
      },
      {
        accessorKey: "date",
        header: "Date",
      },
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "view",
        header: "View/Edit",
      },
    ],

    []
  );

  return (
    <>
      <ReportTable columns={columns} data={data} />
    </>
  );
}
