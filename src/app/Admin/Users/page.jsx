"use client";
/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Center, Spinner, Text, Button, Icon, Heading } from "@chakra-ui/react";
import UserTable from "./UserTable.jsx";
import { getSession } from "next-auth/react";
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
  const [users, setUsers] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasUsers, setHasUsers] = useState(false);
  const [index, setIndex] = useState("0");

  const handleSubmitInfo = useCallback(
    (email) => {
      secureLocalStorage.setItem("email", email);
      router.push("/Admin/Users/ViewUser");
    },
    [router]
  );

  useEffect(() => {
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
  }, [hasUsers]);

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
        accessorKey: "status",
        header: "Status",
        cell: ({ cell }) =>
          cell.row.original.status == true ? "Suspended" : "Active",
      },
    ],

    [handleSubmitInfo]
  );

  const data = useMemo(
    () => [
      {
        membership: "group1",
        managed: "",
        name: "user1",
        email: "user1@gmail.com",
        role: "User",
      },
      {
        membership: "group2",
        managed: "group1",
        name: "sup1",
        email: "sup1@gmail.com",
        role: "Supervisor",
      },
      {
        membership: "unassigned",
        managed: "",
        firstName: "user2",
        lastName: "last",
        suffix: "jr.",
        email: "user2@gmail.com",
        role: "User",
      },
      {
        membership: "group3",
        managed: "",
        name: "sup2",
        email: "sup2@gmail.com",
        role: "Supervisor",
      },
    ],
    []
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
          <Heading mb={10}>Manage Users</Heading>
          <UserTable columns={columns} data={users} />
        </>
      )}
    </>
  );
}
