"use client";
import { useState } from "react";
import {
  VStack,
  Text,
  Center,
  HStack,
  StackDivider,
  Button,
} from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { getSession } from "next-auth/react";
import { getUser } from "./../../actions/User.js";

export default function Page() {
  const [email, setEmail] = useState("");
  //const [rank, setRank] = useState("");
  //const [firstName, setFirstName] = useState("");
  //const [lastName, setLastName] = useState("");
  //const [suffix, setSuffix] = useState("");
  const [hasEmail, setHasEmail] = useState(false);
  const [profile, setProfile] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!hasEmail) {
      //console.log("!hasemail");
      setIsLoading(true);
      setHasError(false);
      getSession()
        .then((session) => setEmail(session.user.email))
        .then(() => setHasEmail(true));
    }
    if (hasEmail && !hasProfile) {
      console.log("hasEmail && !hasprovile", email, hasProfile);
      setIsLoading(true);
      console.log("isLoading:", isLoading);
      setHasError(false);
      getUser({ email }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setProfile(response))
              .then(setHasProfile(true))
          : setHasError(true).then(console.log("hasError:", hasError));
      });
    }
    if (hasEmail && hasProfile) {
      console.log("hasEmail && hasProfile", email, hasProfile);
      setIsLoading(false);
    }
  }, [hasEmail, hasProfile, email]);
  const handleLogout = (e) => {
    e.preventDefault();
    signOut({ callbackUrl: "/Auth/Logout" });
  };
  return (
    <Box>
      <Center my="2em">
        <VStack>
          <Box h="10"></Box>

          <HStack
            spacing={20}
            divider={<StackDivider borderColor={"black"} borderWidth={2} />}
          >
            <VStack alignItems="start">
              <Box p="5">
                <Text fontSize="2xl" fontWeight="bold">
                  Primary Email
                </Text>
                <Text fontSize="lg">{email}</Text>
              </Box>
              <Box p="5">
                <Text fontSize="2xl" fontWeight="bold">
                  Rank
                </Text>
                <Text fontSize="lg">{profile.rank}</Text>
              </Box>
              <Box p="5">
                <Text fontSize="2xl" fontWeight="bold">
                  Name
                </Text>
                <Text fontSize="lg">
                  {profile.firstName} {profile.lastName} {profile.suffix}
                </Text>
              </Box>
            </VStack>
            <VStack spacing={10}>
              <Button isDisabled>Change Password</Button>
              <Button isDisabled>Edit Profile</Button>
              <Button isDisabled>Delete Account</Button>
              <Button
                bgColor={"#70A0AF"}
                color={"white"}
                _hover={{ bgColor: "#706993", color: "white" }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </VStack>
          </HStack>
        </VStack>
      </Center>
    </Box>
  );
}
