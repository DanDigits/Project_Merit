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
import { PiEyeBold } from "react-icons/pi";
import GroupTable from "./GroupTable";
//import { getAllGroups } from "";
import { getSession } from "next-auth/react";
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
  const [groups, setGroups] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasGroups, setHasGroups] = useState(false);
  const [index, setIndex] = useState("0");

  const handleSubmitInfo = useCallback(
    (groupName) => {
      secureLocalStorage.setItem("groupName", groupName);
      router.push("/Admin/Groups/ViewGroup");
    },
    [router]
  );

  useEffect(() => {
    if (!hasGroups) {
      console.log("!hasgroups", hasGroups);
      setIsLoading(true);
      setHasError(false);
      getAllGroups({ index }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setGroups(response))
              .then(setHasGroups(true))
          : setHasError(true);
      });
    }
    if (hasGroups) {
      console.log("hasgroups", hasGroups);
      setIsLoading(false);
    }
  }, [hasGroups, index]);

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
              onClick={() => handleSubmitInfo(cell.row.original.groupName)}
            >
              <Icon as={PiEyeBold} />
            </Button>
          </>
        ),
      },
      {
        accessorKey: "groupName",
        header: "Group Name",
      },
      {
        accessorKey: "supervisor",
        header: "Supervisor",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "total",
        header: "Total Members",
      },
    ],

    [handleSubmitInfo]
  );

  const data = useMemo(
    () => [
      {
        groupName: "group1",
        supervisor: "sup1",
        email: "sup1@gmail.com",
        total: 9,
      },
      {
        groupName: "group2",
        supervisor: "sup2",
        email: "sup2@gmail.com",
        total: 24,
      },
      {
        groupName: "group3",
        supervisor: "sup3",
        email: "sup3@gmail.com",
        total: 12,
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
          <Heading mb={10}>Manage Groups</Heading>
          <GroupTable columns={columns} data={data} />
        </>
      )}
    </>
  );
}
