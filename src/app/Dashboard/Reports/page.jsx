"use client";

import React, { useEffect, useState, useRef } from "react";

import ReportTable from "./ReportTable";
import { getSession } from "next-auth/react";
import { getUserReports } from "./../../actions/Report.js";

/*const data = [
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
];*/

function IndeterminateCheckbox({ indeterminate, className = "", ...rest }) {
  const ref = useRef(null);

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
  const [email, setEmail] = useState("");
  const [reports, setReports] = useState("");

  useEffect(() => {
    getSession().then((session) => setEmail(session.user.email));

    loadReports();
  }, []);

  const loadReports = () => {
    getUserReports({ email }).then((response) => {
      if (response.ok) {
        {
          setReports(response.json());
          console.log(reports);
        }
      } else {
        alert("Error loading report list.");
      }
    });
  };

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
      <ReportTable columns={columns} data={reports} />
    </>
  );
}
