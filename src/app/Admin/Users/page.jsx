"use client";
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Center, Spinner, Text, Button, Icon, Heading } from "@chakra-ui/react";
import UserTable from "./UserTable.jsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { PiEyeBold } from "react-icons/pi";
import { getAllUsers } from "./../../actions/User.js";

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
  const [role, setRole] = useState("");
  const [users, setUsers] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasUsers, setHasUsers] = useState(false);
  const { data: session } = useSession();

  const handleSubmitInfo = useCallback(
    (email) => {
      secureLocalStorage.setItem("email", email);
      router.push("/Admin/Users/ViewUser");
    },
    [router]
  );

  useEffect(() => {
    if (session) {
      if (session?.user.role !== "Admin" && typeof window !== "undefined") {
        router.push("/Dashboard/Home");
      }
    }

    if (!hasUsers) {
      console.log("!hasusers", hasUsers);
      setIsLoading(true);
      setHasError(false);
      getAllUsers().then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setUsers(response))
              .then(setHasUsers(true))
          : setHasError(true);
      });
    }
    if (hasUsers) {
      console.log("hasusers", hasUsers);
      setIsLoading(false);
    }
  }, [hasUsers, session, role, router]);

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
        id: "update",
        header: "Update",
        cell: ({ cell }) => (
          <>
            <Button
              size="sm"
              textColor={"white"}
              bg={"#1c303c"}
              opacity={0.85}
              borderColor={"#354751"}
              borderWidth={"thin"}
              _hover={{ color: "black", bg: "white", opacity: 1 }}
              onClick={() => handleSubmitInfo(cell.row.original.email)}
            >
              <Icon as={PiEyeBold} />
            </Button>
          </>
        ),
      },
      {
        accessorFn: (row) =>
          `${row.lastName}` +
          (row.suffix ? ` ${row.suffix}` : ``) +
          `, ${row.firstName}`,
        id: "name",
        header: "Name",
        cell: (info) => info.getValue(),
      },

      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
        enableColumnFilter: true,
        filterFn: (row, columnId, filterCategories) => {
          if (filterCategories.length === 0) return true;
          const role = row.getValue(columnId);
          return filterCategories.includes(role);
        },
      },
      {
        accessorKey: "group",
        header: "Group Membership",
        cell: ({ cell }) =>
          !cell.row.original.group || cell.row.original.group === "unassigned"
            ? ""
            : cell.row.original.group,
      },
      {
        accessorKey: "supervisedGroup",
        header: "Group Managed",
        cell: ({ cell }) =>
          (!cell.row.original.supervisedGroup ||
            cell.row.original.supervisedGroup === "unassigned") &&
          cell.row.original.role === "Supervisor"
            ? ""
            : cell.row.original.supervisedGroup,
      },
      {
        accessorKey: "totalReports",
        header: "Fiscal Total Reports",
      },
      {
        accessorKey: "mostRecentReportDate",
        header: "Last Report",
      },
      {
        accessorKey: "lastLogin",
        header: "Last Sign-In",
      },
      {
        accessorKey: "suspended",
        header: "Status",
        cell: ({ cell }) =>
          cell.row.original.suspended == true ? "Suspended" : "Active",
      },
    ],

    [handleSubmitInfo]
  );

  return (
    <>
      {hasError && <Text>SOMETHING WENT WRONG</Text>}
      {isLoading && (
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
      )}
      {session?.user.role == "Admin" && (
        <>
          <Heading mb={10}>Manage Users</Heading>
          <UserTable columns={columns} data={users} />
        </>
      )}
    </>
  );
}
