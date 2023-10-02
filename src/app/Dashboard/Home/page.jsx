"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  AbsoluteCenter,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import { Stack, Text, Heading } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import StatusBox from "./StatusBox";

const duties = {
  catagory: "Primary / Additional Duties",
  shorten: "duties",
  total: 6,
  needed: 8,
};
const teamwork = {
  catagory: "Teamwork / Fellowership",
  shorten: "teamwork",
  total: 2,
  needed: 2,
};
const training = {
  catagory: "Training Requirements",
  shorten: "training",
  total: 3,
  needed: 2,
};
const conduct = {
  catagory: "Standards, Conduct, Character & Military Bearings",
  shorten: "conduct",
  total: 4,
  needed: 5,
};

export default function Page() {
  const [rank, setRank] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSession().then((session) => setRank(session.user.rank));
    getSession().then((session) => setLastName(session.user.lastName));
    getSession().then((session) => setSuffix(session.user.suffix));
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <AbsoluteCenter>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="#70A0Af"
              size="xl"
            />
          </AbsoluteCenter>
        </>
      ) : (
        <Card
          p={2}
          alignSelf={"center"}
          size={{ base: "sm", md: "lg" }}
          w={'{ md: "lg" }'}
          bgColor={"white"}
        >
          <Stack m="5vh">
            <Heading
              fontSize={{ base: "25px", md: "30px" }}
              color="#031926"
              py={"5"}
            >
              Welcome {rank} {lastName} {suffix}
            </Heading>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <StatusBox content={duties}></StatusBox>
              <StatusBox content={teamwork}></StatusBox>
              <StatusBox content={training}></StatusBox>
              <StatusBox content={conduct}></StatusBox>
            </SimpleGrid>

            <Card
              bgColor={"#72bfc8"}
              size={{ base: "sm", md: "lg" }}
              variant={"outline"}
              align={"left"}
              mt={6}
              width={{ base: "100%", lg: "md" }}
            >
              <CardHeader pb={"5"}>
                <Heading fontSize={{ base: "smaller", md: "lg" }}>
                  View Last Report
                </Heading>
              </CardHeader>
              <CardBody pt={"0"} pb={"5"}>
                <Text>Written: 09/30/2023</Text>
              </CardBody>
              <CardFooter pt={"0"}>
                <Button bg="white" _hover={{ bg: "#031926", color: "white" }}>
                  View
                </Button>
              </CardFooter>
            </Card>
          </Stack>
        </Card>
      )}
    </>
  );
}
