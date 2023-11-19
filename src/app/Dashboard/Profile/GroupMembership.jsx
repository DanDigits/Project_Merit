"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Card,
  Button,
  ButtonGroup,
  CardBody,
  CardHeader,
  CardFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Center,
  Spinner,
} from "@chakra-ui/react";
import GroupDialog from "./GroupDialog.jsx";
import { getUser } from "src/app/actions/User";
import { getSupervisor, removeFromGroup } from "./../../actions/Group.js";

export default function UpdatePassword() {
  const [email, setEmail] = useState("");
  const [hasEmail, setHasEmail] = useState("");
  const [group, setGroup] = useState("");
  const [hasGroup, setHasGroup] = useState(false);
  const [leader, setLeader] = useState("");
  const [hasLeader, setHasLeader] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status] = useState(false);
  const [profile, setProfile] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [leaderInfo, setLeaderInfo] = useState("");
  const [leaveLoading, setLeaveLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!hasEmail && !isLoading) {
      setIsLoading(true);
      setHasError(false);
      getSession()
        .then((session) => setEmail(session.user.email))
        .then(() => setHasEmail(true));
      setIsLoading(false);
    }

    if (hasEmail && !hasProfile) {
      setIsLoading(true);
      setHasError(false);
      getUser({ email }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setProfile(response))
              .then(setHasProfile(true))
          : setHasError(true);
        console.log("hasError:", hasError);
      });
      setIsLoading(true);
    }

    if (hasEmail && hasProfile && !hasGroup) {
      setIsLoading(true);
      var arr = JSON.parse(JSON.stringify(profile));
      if (arr) {
        setGroup(arr.group);
        console.log("arr", arr);
        setHasGroup(true);
      }
      setHasError(false);
      setIsLoading(false);
    }

    if (hasEmail && hasProfile && hasGroup && !hasLeader) {
      setIsLoading(true);
      setHasError(false);
      getSupervisor({ group }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setLeader(response))
              .then(setHasLeader(true))
          : setHasError(true);
        console.log("hasError:", hasError);
      });
      setIsLoading(true);
    }

    if (hasEmail && hasProfile && hasGroup && hasLeader) {
      setIsLoading(true);
      var arr2 = JSON.parse(JSON.stringify(leader));
      if (arr2) {
        setLeaderInfo(
          [
            arr2[0].rank,
            arr2[0].firstName,
            arr2[0].lastName,
            arr2[0].suffix,
            arr2[0].email,
          ]
            .filter(Boolean)
            .join(" ")
        );
        console.log("arr2", arr2);
        console.log("leaderInfo: " + leaderInfo);
      }

      setHasError(false);
      setIsLoading(false);
    }
  }, [
    isLoading,
    email,
    hasEmail,
    hasError,
    profile,
    hasProfile,
    group,
    hasGroup,
    leader,
    hasLeader,
    leaderInfo,
  ]);

  var userArray = [];
  const handleLeave = () => {
    setLeaveLoading(true);
    userArray.push(email);
    console.log("Attempting to leave group: " + group);
    if (email != "" && userArray.length != 0) {
      removeFromGroup({ userArray }).then((response) => {
        if (response.ok) {
          {
            window.location.reload();
          }
        } else {
          console.log("Error: " + response.error);
          alert("Delete failed");
        }
      });
    }
    setLeaveLoading(false);
  };

  return (
    <>
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
      ) : group === "" ? (
        <Card
          p={{ base: 0, md: 2 }}
          mx={{ base: -4, md: 0 }}
          size={{ base: "sm", md: "lg" }}
          align={"center"}
          bgColor={"white"}
          minW={"md"}
        >
          <CardHeader mb={-5} fontSize={30} color={"black"}>
            Group Membership
          </CardHeader>
          <CardBody>You are currently not assigned to a group</CardBody>
        </Card>
      ) : (
        <>
          <Card
            p={2}
            alignSelf={"center"}
            size={{ base: "sm", md: "md" }}
            w={{ md: "lg" }}
            bgColor={"white"}
          >
            <CardHeader mb={-5} fontSize={30} color={"black"}>
              Group Membership
            </CardHeader>
            <CardBody>
              <div>
                <FormControl id="membership">
                  <FormLabel mb={1} fontSize={15} color={"black"}>
                    Group Name
                  </FormLabel>
                  <Input
                    isReadOnly
                    type=""
                    value={group}
                    variant="login"
                    borderWidth={"2px"}
                    borderColor={"#70A0AF"}
                    bg="#EDF2F7"
                    mb={3}
                    size={"md"}
                    minLength={8}
                    maxLength={32}
                  />
                </FormControl>
                <FormControl id="membership">
                  <FormLabel mb={1} fontSize={15} color={"black"}>
                    Group Leader
                  </FormLabel>
                  <Input
                    isReadOnly
                    type=""
                    value={leaderInfo}
                    variant="login"
                    borderWidth={"2px"}
                    borderColor={"#70A0AF"}
                    bg="#EDF2F7"
                    mb={3}
                    size={"md"}
                    minLength={8}
                    maxLength={32}
                  />
                </FormControl>
              </div>
            </CardBody>
            <CardFooter>
              <ButtonGroup>
                <Button
                  bgColor={"#70A0AF"}
                  color={"white"}
                  _hover={{ bgColor: "#706993", color: "white" }}
                  form="report-form"
                  type="submit"
                  isLoading={leaveLoading}
                  onClick={onOpen}
                >
                  Leave Group
                </Button>
                <AlertDialog isOpen={isOpen} onClose={onClose}>
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Leave Group
                      </AlertDialogHeader>
                      <AlertDialogBody>Are you sure?</AlertDialogBody>
                      <AlertDialogFooter>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                          colorScheme="red"
                          onClick={() => {
                            onClose();
                            handleLeave();
                          }}
                          ml={3}
                        >
                          Leave
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </ButtonGroup>
            </CardFooter>
          </Card>
        </>
      )}
      {GroupDialog(status)}
    </>
  );
}
