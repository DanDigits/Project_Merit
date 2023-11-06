"use client";
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Center, Spinner, Text, Button, Icon } from "@chakra-ui/react";
import ReportTable from "./ReportTable";
import { getSession } from "next-auth/react";
import { getUserReports } from "./../../actions/Report.js";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { PiEyeBold } from "react-icons/pi";

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
  const [index, setIndex] = useState("0");

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
      getUserReports({ email, index }).then((response) => {
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
  }, [hasEmail, hasReport, email, index]);

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
        id: "view",
        header: "View",
        cell: ({ cell }) => (
          <>
            <Button
              size={{ base: "sm", lg: "md" }}
              textColor={"white"}
              bg={"#1c303c"}
              opacity={0.85}
              borderColor={"#354751"}
              borderWidth={"thin"}
              _hover={{ color: "black", bg: "white", opacity: 1 }}
              onClick={() => handleSubmitInfo(cell.row.original._id)}
            >
              <Icon as={PiEyeBold} />
            </Button>
          </>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        enableColumnFilter: true,
        filterFn: (row, columnId, value) => {
          const date = row.getValue(columnId);
          const [start, end] = value; // value => two date input values
          //If one filter defined and date is null filter it
          if ((start || end) && !date) return false;
          if (start && !end) {
            return date >= start;
          } else if (!start && end) {
            return date <= end;
          } else if (start && end) {
            return date >= start && date <= end;
          } else return true;
        },
      },
      {
        accessorKey: "category",
        header: () => "Performance Area",
        enableColumnFilter: true,
        filterFn: (row, columnId, filterCategories) => {
          if (filterCategories.length === 0) return true;
          const category = row.getValue(columnId);
          return filterCategories.includes(category);
        },
      },

      {
        accessorKey: "title",
        header: "Title",
      },
    ],

    [handleSubmitInfo]
  );

  return (
    <>
      {hasError && <Text>SOMETHING WENT WRONG</Text>}
      {isLoading ? (
        <>
          <Center>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="#70A0Af"
              size="xl"
            />
          </Center>
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
