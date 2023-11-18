"use client";
/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { getSession, useSession } from "next-auth/react";
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
import { getUser, updateUser } from "./../../actions/User.js";
import {
  renameGroup,
  deleteGroup,
  getGroup,
  getAllGroups,
} from "./../../actions/Group.js";

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

var mission = 3;
var leadership = 3;
var resources = 3;
var unit = 3;

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
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

  const [hasAllGroups, setHasAllGroups] = useState(false);
  const [allGroups, setAllGroups] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [searchGroup, setSearchGroup] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [newName, setNewName] = useState("");
  const [email, setEmail] = useState("");
  const [existingGroups, setExistingGroups] = useState("");

  const [fetching, setFetching] = useState(true);
  const [rename, setRename] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCreate = () => {
    if (searchGroup != "" && existingGroups != "") {
      setSearchLoading(true);
      var tempStatus = "success";
      console.log("Comparing " + searchGroup + " against existing groups..");
      for (var i = 0; i < existingGroups.length; i++) {
        if (searchGroup === existingGroups[i]) {
          tempStatus = "invalid";
        }
      }
      console.log(tempStatus);
      if (tempStatus != "invalid") {
        updateUser({ email, supervisedGroup: searchGroup }).then((response) => {
          if (response.ok) {
            tempStatus = "success";
            window.location.reload();
          } else tempStatus = "error";
        });
      }
      setStatus(tempStatus);
      setSearchLoading(false);
    }
  };

  const handleChange = (e) => {
    setSearchGroup(e.target.value);
    setStatus("");
  };

  const handleDelete = () => {
    var groupArray = [];
    groupArray.push(groupName);
    console.log("Attempting to delete group: " + groupArray);
    deleteGroup({ groupArray }).then((response) => {
      if (response.ok) {
        {
          window.location.reload();
        }
      } else {
        console.log("Error: " + response.error);
        alert("Delete failed");
      }
    });
  };

  const handleRename = () => {
    renameGroup({ groupName, newName }).then((response) => {
      if (response.ok) {
        {
          window.location.reload();
        }
      } else {
        console.log("Error: " + response.error);
        alert("Rename failed");
      }
    });
  };

  useEffect(() => {
    if (session) {
      if (session?.user.role === "Admin") {
        window.location.replace("/Admin/Groups");
      }
    }

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
        console.log("hasError:", hasError);
      });
      setIsLoading(false);
      if (hasError) {
        console.log("Error fetching profile");
      }
    }

    if (hasProfile && !hasGroupName && !isLoading) {
      setFetching(true);
      setIsLoading(true);
      setHasError(false);

      var arr = JSON.parse(JSON.stringify(profile));
      //console.log("Arr = ", arr);
      if (arr) {
        setGroupName(arr.supervisedGroup);
        setHasGroupName(true);
      }

      setIsLoading(false);
      setFetching(false);
    }

    if (hasGroupName && !hasGroup && !isLoading) {
      setIsLoading(true);
      setHasError(false);
      console.log("Searching for group: " + groupName);
      if (groupName === "") setHasGroup(true);
      else {
        getGroup({ groupName }).then((response) => {
          response.ok
            ? response
                .json()
                .then((response) => setGroup(response))
                .then(setHasGroup(true))
            : setHasError(true);
          console.log("hasError:", hasError);
        });
      }
      setIsLoading(false);
    }

    if (hasGroupName && hasGroup) {
      if (groupName === "") {
        setGroupLength(0);
        setGroupUsers([]);
      } else {
        var arr2 = JSON.parse(JSON.stringify(group));
        if (arr2) {
          //console.log("Arr2 = ", arr2);
          setGroupLength(arr2["1"].length);
          setGroupUsers(arr2["1"]);
          console.log(groupUsers);
        }
      }
      setIsLoading(false);
    }

    if (hasGroupName && groupName === "" && !hasAllGroups) {
      console.log("no group");
      getAllGroups().then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setAllGroups(response))
              .then(setHasAllGroups(true))
          : setHasError(true);
      });
    }
    if (hasGroupName && groupName === "" && hasAllGroups) {
      console.log("no group; arr");
      var temp = [];
      var arr = JSON.parse(JSON.stringify(allGroups));
      if (arr) {
        for (var i = 0; i < arr.length; i++) {
          temp.push(arr[i][0]);
        }
        setExistingGroups(temp);
      }
    }
  }, [
    email,
    hasEmail,
    profile,
    hasProfile,
    isLoading,
    hasGroupName,
    groupName,
    hasGroup,
    group,
    hasAllGroups,
    allGroups,
  ]);

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
      header: "Progress",
      cell: (cell) => {
        var progress = Math.floor(
          (cell.row.original.totalReports /
            (mission + resources + leadership + unit)) *
            100
        );
        return (
          <Badge
            px={5}
            alignItems={"center"}
            bg={
              progress == 100
                ? "green.500"
                : progress > 50
                ? "yellow"
                : progress > 0
                ? "orange"
                : "red"
            }
          >
            {progress} %
          </Badge>
        );
      },
    },
    {
      header: "Category Fiscal Totals",
      columns: [
        {
          accessorKey: "Mission",
          header: "Mission",
        },
        {
          accessorKey: "Leadership",
          header: "Leadership",
        },

        {
          accessorKey: "Resources",
          header: "Resources",
        },
        {
          accessorKey: "Unit",
          header: "Unit",
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
      ) : groupName === "" ? (
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
                    onClick={() => handleCreate()}
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
                          onClose();
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
          <GroupTable group={groupName} columns={columns} data={groupUsers} />
        </>
      )}
    </>
  );
}
