"use client";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { Stack, Text, VStack, HStack, Heading } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { getLastReport, getTotals } from "./../../actions/Report.js";

export default function Page() {
  const [email, setEmail] = useState("");
  const [rank, setRank] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [totals, setTotals] = useState("");
  const [report, setReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasEmail, setHasEmail] = useState(false);
  const [hasTotals, setHasTotals] = useState(false);
  const [hasReport, setHasReport] = useState(false);

  useEffect(() => {
    getSession().then((session) => setEmail(session.user.email));
    getSession().then((session) => setRank(session.user.rank));
    getSession().then((session) => setLastName(session.user.lastName));
    getSession().then((session) => setSuffix(session.user.suffix));
  }, []);

  useEffect(() => {
    if (!hasEmail) {
      //console.log("!hasemail");
      setIsLoading(true);
      setHasError(false);
      getSession()
        .then((session) => setEmail(session.user.email))
        .then(() => setHasEmail(true));
    }
    if (hasEmail && !hasTotals) {
      console.log("hasEmail && !hasTotals", email, hasTotals);
      setIsLoading(true);
      setHasError(false);
      getTotals({ email }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setTotals(response))
              .then(setHasTotals(true))
          : setHasError(true);
        console.log("hasError:", hasError);
      });
    }
    if (hasEmail && !hasReport) {
      console.log("hasEmail && !hasReport", email, hasReport);
      setIsLoading(true);
      setHasError(false);
      getLastReport({ email }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setReport(response))
              .then(setHasReport(true))
          : setHasError(true);
        console.log("hasError:", hasError);
      });
    }
    if (hasEmail && hasTotals && hasReport) {
      console.log(
        "hasEmail && hasTotals && hasReport",
        email,
        hasTotals,
        hasReport
      );
      setIsLoading(false);
      console.log("isLoading:", isLoading);
      console.log("totals:", totals);
      console.log("report:", report);
    }
  }, [hasEmail, hasTotals, email]);

  return (
    <>
      <Card
        p={5}
        alignSelf={"center"}
        alignItems={"center"}
        size={{ base: "sm", md: "md" }}
        w={{ md: "lg" }}
        bgColor={"white"}
      >
        <Stack alignItems={"center"}>
          <Heading
            fontSize={{ base: "25px", md: "30px" }}
            color="#331E38"
            align={"center"}
            py={"5"}
          >
            Welcome {rank} {lastName} {suffix}
          </Heading>
          <Card
            bgColor={"#F4E8C1"}
            size={{ base: "sm", md: "lg" }}
            variant={"outline"}
            align={"center"}
            width={{ md: "md" }}
          >
            <CardHeader pb={"5"}>
              <Heading fontSize={"20"}>Total Reports for the Year</Heading>
            </CardHeader>
            <CardBody pt={"0"} pb={"5"}>
              <Text color={"#331E38"} fontSize={"30"} fontWeight={"semibold"}>
                15
              </Text>
            </CardBody>
          </Card>
          <HStack spacing={4} alignSelf={"center"}>
            <Card
              bgColor={"#A0C1B9"}
              size={{ base: "sm", md: "lg" }}
              variant={"outline"}
              align={"center"}
            >
              <CardBody>
                <VStack>
                  <Text color={"#331E38"} fontWeight={"semibold"}>
                    Primary / Additional Duties
                  </Text>
                  <Text color={"#331E38"} fontSize={30}>
                    2
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            <Card
              bgColor={"#70A0AF"}
              size={{ base: "sm", md: "lg" }}
              variant={"outline"}
              align={"center"}
            >
              <CardBody>
                <VStack>
                  <Text color={"#331E38"} fontWeight={"semibold"}>
                    Standards, Conduct, Character & Military Bearing
                  </Text>
                  <Text color={"#331E38"} fontSize={30}>
                    5
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </HStack>
          <HStack spacing={4} alignSelf={"center"}>
            <Card
              bgColor={"#70A0AF"}
              size={{ base: "sm", md: "lg" }}
              variant={"outline"}
              align={"center"}
            >
              <CardBody>
                <VStack>
                  <Text color={"#331E38"} fontWeight={"semibold"}>
                    Training Requirements
                  </Text>
                  <Text color={"#331E38"} fontSize={30}>
                    7
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            <Card
              bgColor={"#A0C1B9"}
              size={{ base: "sm", md: "lg" }}
              variant={"outline"}
              align={"center"}
            >
              <CardBody>
                <VStack>
                  <Text color={"#331E38"} fontWeight={"semibold"}>
                    Teamwork / Followership
                  </Text>
                  <Text color={"#331E38"} fontSize={30}>
                    0
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </HStack>
          <Card
            bgColor={"#F4E8C1"}
            size={{ base: "sm", md: "lg" }}
            variant={"outline"}
            align={"center"}
            width={{ md: "md" }}
          >
            <CardHeader pb={"5"}>
              <Heading fontSize={"20"}>Date of Last Report: 00/00/0000</Heading>
            </CardHeader>
            <CardFooter pt={"0"}>
              <Button bg="white" _hover={{ bg: "#331E38", color: "white" }}>
                View Last Report
              </Button>
            </CardFooter>
          </Card>
        </Stack>
      </Card>
    </>
  );
}
