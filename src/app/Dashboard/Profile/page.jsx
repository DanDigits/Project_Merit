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

export default function Page() {
  const [email, setEmail] = useState("");
  const [rank, setRank] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [reportType, setReportType] = useState(0);

  useEffect(() => {
    getSession().then((session) => setEmail(session.user.email));
    getSession().then((session) => setRank(session.user.rank));
    getSession().then((session) => setFirstName(session.user.firstName));
    getSession().then((session) => setLastName(session.user.lastName));
    getSession().then((session) => setSuffix(session.user.suffix));
    getSession().then((session) => setReportType(session.user.reportType));
  }, []);
  const handleLogout = (e) => {
    e.preventDefault();
    signOut({ callbackUrl: "/Logout" });
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
                  Name
                </Text>
                <Text fontSize="lg">
                  {firstName} {lastName}
                </Text>
              </Box>
              <Box p="5">
                <Text fontSize="2xl" fontWeight="bold">
                  Suffix
                </Text>
                <Text fontSize="lg">{suffix}</Text>
              </Box>
              <Box p="5">
                <Text fontSize="2xl" fontWeight="bold">
                  Rank
                </Text>
                <Text fontSize="lg">{rank}</Text>
              </Box>
              <Box p="5">
                <Text fontSize="2xl" fontWeight="bold">
                  Report Type
                </Text>
                <Text fontSize="lg">{reportType}</Text>
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
