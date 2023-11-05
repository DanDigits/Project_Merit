"use client";
/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Center,
  Spinner,
  Text,
  Badge,
  Heading,
  Card,
  CardHeader,
  CardBody,
  HStack,
  Button,
  VStack,
  Box,
  Input,
} from "@chakra-ui/react";
import GroupTable from "./GroupTable";
//import { getGroup } from "";
import { useRouter } from "next/navigation";

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
  const [group, setGroup] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasGroup, setHasGroup] = useState(false);
  const [index, setIndex] = useState("0");
  const [openCreate, setOpenCreate] = useState(false);
  const [searchGroup, setSearchGroup] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [status, setStatus] = useState("");

  const groupName = "Group 1";
  const totalMembers = 4;

  const handleCreate = () => {
    setStatus("invalid");
    if (status === "success") window.location.reload;
  };

  const handleChange = (e) => {
    setSearchGroup(e.target.value);
    setStatus("");
  };

  /*useEffect(() => {
    if (!hasGroup) {
      console.log("!hasgroup", hasGroup);
      setIsLoading(true);
      setHasError(false);
      getAllGroup({ index }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setGroup(response))
              .then(setHasGroup(true))
          : setHasError(true);
      });
    }
    if (hasGroup) {
      console.log("hasgroup", hasGroup);
      setIsLoading(false);
    }
  }, [hasGroup, index]);*/

  const columns = React.useMemo(() => [
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
      accessorFn: (row) => `${row.lastName}, ${row.firstName}`,
      id: "name",
      header: "Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: (info) => {
        return (
          <Badge
            px={5}
            alignItems={"center"}
            bg={
              info.getValue() == 100
                ? "green.500"
                : info.getValue() > 50
                ? "yellow"
                : info.getValue() > 0
                ? "orange"
                : "red"
            }
          >
            {info.getValue()}
          </Badge>
        );
      },
    },
    {
      header: "Category Fiscal Totals",
      columns: [
        {
          accessorKey: "conduct",
          header: "Conduct",
        },
        {
          accessorKey: "duties",
          header: "Duties",
        },

        {
          accessorKey: "teamwork",
          header: "Teamwork",
        },
        {
          accessorKey: "training",
          header: "Training",
        },
      ],
    },
  ]);

  const data = useMemo(() => [
    {
      firstName: "first",
      lastName: "last",
      email: "user1@gmail.com",
      progress: 50,
      conduct: 0,
      duties: 2,
      teamwork: 3,
      training: 2,
    },
    {
      firstName: "first",
      lastName: "last",
      email: "user2@gmail.com",
      progress: 71,
      conduct: 4,
      duties: 1,
      teamwork: 2,
      training: 3,
    },
    {
      firstName: "first",
      lastName: "last",
      email: "user3@gmail.com",
      progress: 0,
      conduct: 0,
      duties: 0,
      teamwork: 0,
      training: 0,
    },
    {
      firstName: "first",
      lastName: "last",
      email: "user4@gmail.com",
      progress: 100,
      conduct: 6,
      duties: 3,
      teamwork: 3,
      training: 4,
    },
  ]);

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
      ) : data.length == 0 ? (
        <Card
          p={{ base: 0, md: 2 }}
          mx={{ base: -4, md: 0 }}
          size={{ base: "sm", md: "lg" }}
          align={"center"}
          bgColor={"white"}
        >
          <CardHeader p={3} fontSize={"lg"} fontWeight={"bold"}>
            No Group
          </CardHeader>
          <CardBody mt={-4}>
            <VStack spacing={4}>
              <Text>You are currently not managing a group.</Text>
              <Button onClick={() => setOpenCreate(!openCreate)}>
                Create Group
              </Button>
              <Box p={2} display={openCreate ? "initial" : "none"}>
                <Text>Enter Group Name:</Text>
                <HStack justify={"flex-start"}>
                  <Input
                    value={searchGroup}
                    size={{ base: "sm", md: "md" }}
                    w={{ base: "50%", md: "xs" }}
                    variant="login"
                    borderWidth={"1px"}
                    borderColor={"#70A0AF"}
                    bg="#ECECEC"
                    onChange={(e) => handleChange(e)}
                  />
                  <Button
                    size={{ base: "sm", md: "md" }}
                    bgColor={"#6abbc4"}
                    color={"black"}
                    _hover={{ bgColor: "#031926", color: "white" }}
                    isLoading={searchLoading}
                    onClick={() => handleCreate(searchGroup)}
                  >
                    Create
                  </Button>
                </HStack>
                {status === "error" && (
                  <p>There was an error when creating group.</p>
                )}
                {status === "invalid" && <p>This group name already exist.</p>}
                {status === "success" && <p>Group successfully created.</p>}
              </Box>
            </VStack>
          </CardBody>
        </Card>
      ) : (
        <>
          {console.log(group)}
          <Heading mb={7}>Manage Group</Heading>
          <Card
            p={{ base: 0, md: 2 }}
            mx={{ base: -4, md: 0 }}
            mb={8}
            size={{ base: "sm", md: "lg" }}
            w="50%"
            bgColor={"white"}
          >
            <CardHeader p={3} fontSize={"lg"} fontWeight={"bold"}>
              Group Info
            </CardHeader>
            <CardBody mt={-4}>
              <VStack align={"start"}>
                <Text>Group Name: {groupName}</Text>
                <Text>Total Members: {totalMembers}</Text>
              </VStack>
            </CardBody>
          </Card>
          <GroupTable columns={columns} data={data} />
        </>
      )}
    </>
  );
}
