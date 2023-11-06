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
//import { getAllUsers } from "";
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
  const [users, setUsers] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasUsers, setHasUsers] = useState(false);
  const [index, setIndex] = useState("0");

  const handleSubmitInfo = useCallback(
    (name) => {
      secureLocalStorage.setItem("userName", name);
      router.push("/Admin/Users/ViewUser");
    },
    [router]
  );

  /*useEffect(() => {
    if (!hasUsers) {
      console.log("!hasuser", hasUsers);
      setIsLoading(true);
      setHasError(false);
      getAllUsers({ index }).then((response) => {
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
  }, [hasUsers, index]);*/

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
        accessorKey: "name",
        header: "Name",
      },

      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
      },
      {
        accessorKey: "membership",
        header: "Group Membership",
        cell: ({ cell }) =>
          !cell.row.original.membership ||
          cell.row.original.membership === "unassigned"
            ? ""
            : cell.row.original.membership,
      },
      {
        accessorKey: "managed",
        header: "Group Managed",
        cell: ({ cell }) =>
          (!cell.row.original.managed ||
            cell.row.original.managed === "unassigned") &&
          cell.row.original.role === "Supervisor"
            ? ""
            : cell.row.original.managed,
      },
      {
        accessorKey: "totalReports",
        header: "Fiscal Total Reports",
      },
      {
        accessorKey: "lastReport",
        header: "Last Report",
      },
      {
        accessorKey: "lastSignIn",
        header: "Last Sign-In",
      },
      {
        accessorKey: "status",
        header: "Status",
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
              onClick={() => handleSubmitInfo(cell.row.original.name)}
            >
              <Icon as={PiEyeBold} />
            </Button>
          </>
        ),
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
        name: "user2",
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
          <UserTable columns={columns} data={data} />
        </>
      )}
    </>
  );
}
