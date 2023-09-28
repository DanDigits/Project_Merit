"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { AbsoluteCenter, Spinner, Text, Button } from "@chakra-ui/react";
import ReportTable from "./ReportTable";
import { getSession } from "next-auth/react";
import { getUserReports } from "./../../actions/Report.js";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";

function IndeterminateCheckbox({ indeterminate, className = "", ...rest }) {
  const ref = useRef(null);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

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
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [reports, setReports] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasEmail, setHasEmail] = useState(false);
  const [hasReport, setHasReport] = useState(false);

  const handleSubmitInfo = useCallback(
    (reportId) => {
      secureLocalStorage.setItem("reportID", reportId);
      router.push("/Dashboard/ViewReport");
    },
    [router]
  );

  useEffect(() => {
    if (!hasEmail) {
      //console.log("!hasemail");
      setIsLoading(true);
      setHasError(false);
      getSession()
        .then((session) => setEmail(session.user.email))
        .then(() => setHasEmail(true));
    }
    if (hasEmail && !hasReport) {
      console.log("hasEmail && !hasreport", email, hasReport);
      setIsLoading(true);
      setHasError(false);
      getUserReports({ email }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setReports(response))
              .then(setHasReport(true))
          : setHasError(true);
      });
    }
    if (hasEmail && hasReport) {
      console.log("hasEmail && hasreport", email, hasReport);
      setIsLoading(false);
    }
  }, [hasEmail, hasReport, email]);

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
        accessorKey: "category",
        header: () => "Category",
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
        accessorKey: "report",
        header: "Content",
      },

      {
        id: "view",
        header: "View/Edit",
        cell: ({ cell }) => (
          <>
            <Button
              textColor={"white"}
              bg={"#706993"}
              onClick={() => handleSubmitInfo(cell.row.original._id)}
            >
              View
            </Button>
          </>
        ),
      },
    ],

    [handleSubmitInfo]
  );

  return (
    <>
      {hasError && <Text>SOMETHING WENT WRONG</Text>}
      {isLoading ? (
        <>
          <AbsoluteCenter>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="#70A0Af"
              size="xl"
            />
          </AbsoluteCenter>
        </>
      ) : (
        <>
          {console.log(reports)}
          <ReportTable columns={columns} data={reports} />
        </>
      )}
    </>
  );
}
