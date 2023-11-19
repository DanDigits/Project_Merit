"use client";
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Center, Spinner, Text, Button, Icon, Heading } from "@chakra-ui/react";
import { PiEyeBold } from "react-icons/pi";
import GroupTable from "./GroupTable";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { getAllGroups } from "./../../actions/Group.js";

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
  const { data: session } = useSession();
  const [groups, setGroups] = useState("");
  const [data, setData] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasGroups, setHasGroups] = useState(false);

  const handleSubmitInfo = useCallback(
    (groupName) => {
      console.log(groupName);
      secureLocalStorage.setItem("groupName", groupName);
      router.push("/Admin/Groups/ViewGroup");
    },
    [router]
  );

  useEffect(() => {
    if (session) {
      if (session?.user.role !== "Admin" && typeof window !== "undefined") {
        window.location.replace("/Dashboard/Home");
      }
    }

    if (!hasGroups) {
      console.log("!hasgroups", hasGroups);
      setIsLoading(true);
      setHasError(false);
      getAllGroups().then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setGroups(response))
              .then(setHasGroups(true))
          : setHasError(true);
      });
      setIsLoading(false);
    }
    if (hasGroups && !isLoading) {
      console.log("hasgroups", hasGroups);
      var arr = JSON.parse(JSON.stringify(groups));
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][1] == null) {
          arr[i][1] = {};
        }
        arr[i][1].group = arr[i][0];
        arr[i].splice(0, 1);
        arr[i] = arr[i][0];
      }
      //console.log(arr);
      setData(arr);
      setIsLoading(false);
    }
  }, [hasGroups, groups, isLoading, session]);

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
              size={{ base: "sm", lg: "md" }}
              textColor={"white"}
              bg={"#1c303c"}
              opacity={0.85}
              borderColor={"#354751"}
              borderWidth={"thin"}
              _hover={{ color: "black", bg: "white", opacity: 1 }}
              onClick={() => handleSubmitInfo(cell.row.original.group)}
            >
              <Icon as={PiEyeBold} />
            </Button>
          </>
        ),
      },
      {
        accessorKey: "group",
        header: "Group Name",
      },
      {
        accessorFn: (row) =>
          row.lastName
            ? `${row.lastName}` +
              (row.suffix ? ` ${row.suffix}` : ``) +
              `, ${row.firstName}`
            : "",
        id: "supervisor",
        header: "Supervisor",
      },
      {
        accessorKey: "email",
        header: "Email",
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
          <Heading mb={10}>Manage Groups</Heading>
          <GroupTable columns={columns} data={data} />
        </>
      )}
    </>
  );
}
