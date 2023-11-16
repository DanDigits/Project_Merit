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
import { getUser } from "./../../actions/User.js";
import { getGroup } from "./../../actions/Group.js";
import { renameGroup, deleteGroup } from "./../../actions/Group.js";

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
  const [groupLength, setGroupLength] = useState("");
  const [groupName, setGroupName] = useState("");
  const [profile, setProfile] = useState("");
  const [groupUsers, setGroupUsers] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasEmail, setHasEmail] = useState(false);
  const [hasGroup, setHasGroup] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [hasGroupName, setHasGroupName] = useState(false);
  const [index, setIndex] = useState("0");

  const [openCreate, setOpenCreate] = useState(false);
  const [searchGroup, setSearchGroup] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [newName, setNewName] = useState("");
  const [email, setEmail] = useState("");

  const [fetching, setFetching] = useState(true);
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

  const handleDelete = () => {
    console.log("Attempting to delete group: " + groupName);
    deleteGroup({ groupName }).then((response) => {
      if (response.ok) {
        {
          window.location.reload;
        }
      } else {
        console.log("Error: " + response.error);
        alert("Delete failed");
      }
    });
  };

  const handleRename = (groupName) => {
    console.log(groupName);
    renameGroup({ groupName, newName }).then((response) => {
      if (response.ok) {
        {
          window.location.reload;
        }
      } else {
        console.log("Error: " + response.error);
        alert("Rename failed");
      }
    });
  };

  useEffect(() => {
    if (!hasEmail && !isLoading) {
      setIsLoading(true);
      setHasError(false);
      console.log("Fetching email...");
      getSession()
        .then((session) => setEmail(session.user.email))
        .then(() => setHasEmail(true));
      console.log("Got email");
      setIsLoading(false);
    }

    if (hasEmail && !hasProfile && !isLoading) {
      setIsLoading(true);
      setHasError(false);
      console.log("Fetching profile");
      getUser({ email }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setProfile(response))
              .then(setHasProfile(true))
              .then(console.log("Got profile"))
          : setHasError(true);
      });
      setIsLoading(false);
      if (hasError) {
        console.log("Error fetching profile");
      }
    }

    if (hasEmail && hasProfile && !isLoading) {
      setFetching(true);
      setIsLoading(true);
      setHasError(false);

      var arr = JSON.parse(JSON.stringify(profile));
      if (arr) {
        setGroupName(arr.supervisedGroup);

        if (!groupName || groupName == "") {
          setGroupName(arr.supervisedGroup);
        }
      }

      setHasGroupName(true);
      setIsLoading(false);
      setFetching(false);
    }

    if (hasEmail && hasProfile && hasGroupName && !hasGroup && !isLoading) {
      setIsLoading(true);
      setHasError(false);
      console.log("Searching for group: " + groupName);
      getGroup({ groupName }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setGroup(response))
              .then(setHasGroup(true))
          : setHasError(true);
        console.log("hasError:", hasError);
      });
      setIsLoading(false);
    }

    if (hasEmail && hasProfile && hasGroupName && hasGroup) {
      var arr = JSON.parse(JSON.stringify(group));
      if (arr) {
        console.log("Arr = ", arr);
        setGroupLength(arr["1"].length);
        setGroupUsers(arr["1"]);
      }
      setIsLoading(false);
    }
  }, [group, hasGroup, groupName, email, hasEmail, profile, hasProfile]);

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
      {isLoading || fetching ? (
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
      ) : groupLength == 0 ? (
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
                  <Text>Total Members: {groupLength}</Text>
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
          <GroupTable columns={columns} data={groupUsers} />
        </>
      )}
    </>
  );
}
