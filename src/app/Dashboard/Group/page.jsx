"use client";
/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { getSession } from "next-auth/react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  useDisclosure,
} from "@chakra-ui/react";
import GroupTable from "./GroupTable";
import { useRouter } from "next/navigation";
import { getGroup } from "./../../actions/Group.js";
//import { renameGroup, deleteGroup } from "";

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

const handleDelete = () => {
  /*deleteGroup({ groupName }).then((response) => {
    if (response.ok) {
      {
        window.location.reload;
      }
    } else {
      console.log("Error: " + response.error);
      alert("Delete failed");
    }
  });*/
};

const handleRename = (groupName) => {
  console.log(groupName);
  /* renameGroup({ groupName }).then((response) => {
    if (response.ok) {
      {
        window.location.reload;
      }
    } else {
      console.log("Error: " + response.error);
      alert("Rename failed");
    }
  });*/
};

export default function Page() {
  const router = useRouter();
  const [group, setGroup] = useState("");
  const [groupName, setGroupName] = useState(""); // need to update
  const [groupTotal, setGroupTotal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasGroup, setHasGroup] = useState(false);
  const [hasGroupName, setHasGroupName] = useState(false);
  const [index, setIndex] = useState("0");
  const [openCreate, setOpenCreate] = useState(false);
  const [searchGroup, setSearchGroup] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [newName, setNewName] = useState("");

  const [fetching, setFetching] = useState(false);
  const [rename, setRename] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCreate = () => {
    setStatus("invalid");
    if (status === "success") window.location.reload;
  };

  const handleChange = (e) => {
    setSearchGroup(e.target.value);
    setStatus("");
  };

  useEffect(() => {
    if (!hasGroupName && !isLoading) {
      setFetching(true);
      console.log("Fetching email and supervisedGroup");
      setIsLoading(true);
      setHasError(false);
      getSession()
        .then((session) => {
          //var managed = session.user.supervisedGroup;
          var managed = "Alpha 1";
          if (managed) {
            setGroupName(managed);
          }
        })
        .then(setHasGroupName(true))
        .then(setIsLoading(false));
    }

    if (hasGroupName && !hasGroup && !isLoading) {
      setIsLoading(true);
      setHasError(false);
      getGroup({ groupName }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setGroup(response))
              .then(setHasGroup(true))
              .then(setIsLoading(false))
          : setHasError(true);
        console.log("hasError:", hasError);
      });
    }
  }, [group, hasGroup, groupName]);

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

  return (
    <>
      {hasError && <Text>SOMETHING WENT WRONG</Text>}
      {isLoading || !fetching ? (
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
      ) : group.length == 0 ? (
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
          <HStack justify={"space-between"} align={"flex-start"}>
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
                  {rename ? (
                    <HStack>
                      <Text>Group Name: </Text>
                      <Input
                        w={"xs"}
                        value={newName}
                        variant="login"
                        borderWidth={"1px"}
                        borderColor={"#70A0AF"}
                        bg="#ECECEC"
                        onChange={(e) => setNewName(e.target.value)}
                      ></Input>
                      <Button onClick={() => handleRename(newName)}>
                        Submit
                      </Button>
                    </HStack>
                  ) : (
                    <Text>Group Name: {groupName}</Text>
                  )}
                  <Text>Total Members: {group[1].length}</Text>
                </VStack>
              </CardBody>
            </Card>
            <HStack>
              <Button
                bgColor={"#6abbc4"}
                color={"black"}
                _hover={{ bgColor: "#031926", color: "white" }}
                onClick={() => setRename(!rename)}
              >
                Rename
              </Button>
              <Button
                bgColor={"#FFC370"}
                color={"black"}
                _hover={{ bgColor: "#DF2935", color: "white" }}
                onClick={onOpen}
              >
                Delete Group
              </Button>
              <AlertDialog isOpen={isOpen} onClose={onClose}>
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Delete Group
                    </AlertDialogHeader>
                    <AlertDialogBody>Are you sure?</AlertDialogBody>
                    <AlertDialogFooter>
                      <Button onClick={onClose}>Cancel</Button>
                      <Button
                        colorScheme="red"
                        onClick={() => {
                          handleDelete();
                        }}
                        ml={3}
                      >
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </HStack>
          </HStack>
          <GroupTable columns={columns} data={group[1]} />
        </>
      )}
    </>
  );
}
