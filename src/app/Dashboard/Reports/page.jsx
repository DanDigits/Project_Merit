/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-key */
/* eslint-disable no-undef */
/* eslint-disable react/display-name */
// Line 176, (row, i)
"use client";
import React, { useMemo, useEffect, useState } from "react";
import { Button, Select } from "@chakra-ui/react";
import { getUserReports } from "src/app/actions/Report";
import { getSession } from "next-auth/react";
import ReportTable from "./ReportTable.jsx";

export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);
  return (
    <Select
      size={"xs"}
      bgColor="white"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </Select>
  );
}

export default function Page() {
  /* 
    - Columns is a simple array right now, but it will contain some logic later on. It is recommended by react-table to memoize the columns data
    - Here in this example, we have grouped our columns into two headers. react-table is flexible enough to create grouped table headers
  */
  const [rowSelection, setRowSelection] = React.useState({});
  const [email, setEmail] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    getSession().then((session) => setEmail(session.user.email));
  }, []);

  const loadReports = () => {
    getUserReports({ email }).then((response) => {
      if (response.ok) {
        {
          setData(JSON.parse(JSON.stringify(response)));
        }
      } else {
        alert("Error loading report list.");
      }
    });
  };
  const columns = useMemo(
    () => [
      {
        Header: "Q#",
        accessor: "quarter",
        Filter: SelectColumnFilter,
        filter: "",
      },
      {
        Header: "Date",
        accessor: "date",
        Filter: SelectColumnFilter,
        filter: "",
      },
      {
        Header: "Title",
        accessor: "title",
        Filter: "",
        filter: "",
      },
      {
        Header: "View/Edit",
        accessor: "view",
        Filter: "",
        filter: "",
      },
    ],
    []
  );

  return (
    <>
      <Button
        bgColor={"#70A0AF"}
        color={"white"}
        _hover={{ bgColor: "#706993", color: "white" }}
        onClick={loadReports()}
      >
        Load Reports
      </Button>
      <ReportTable columns={columns} data={data} />
    </>
  );
}
