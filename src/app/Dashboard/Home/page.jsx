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
import { getLastReport, getTotals } from "./../../actions/Report.js";
import StatusBox from "./StatusBox";

export default function Page() {
  const [hasEmail, setHasEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [rank, setRank] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [hasReport, setHasReport] = useState(false);
  const [report, setReport] = useState({
    title: "",
    category: "",
    date: "",
    data: "",
  });
  /*
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [reportData, setReportData] = useState(""); */

  const [hasTotals, setHasTotals] = useState(false);
  const [totals, setTotals] = useState("");
  const [totalReports, setTotalReports] = useState("");
  const [quarterReports, setQuarterReports] = useState("");
  const [duties, setDuties] = useState({
    catagory: "Primary / Additional Duties",
    shorten: "duties",
    total: 0,
    needed: 8,
  });
  const [conduct, setConduct] = useState({
    catagory: "Standards, Conduct, Character & Military Bearings",
    shorten: "conduct",
    total: 0,
    needed: 5,
  });
  const [training, setTraining] = useState({
    catagory: "Training Requirements",
    shorten: "training",
    total: 0,
    needed: 2,
  });
  const [teamwork, setTeamwork] = useState({
    catagory: "Teamwork / Fellowership",
    shorten: "teamwork",
    total: 0,
    needed: 2,
  });

  useEffect(() => {
    if (!hasEmail) {
      setIsLoading(true);
      setHasError(false);
      getSession()
        .then((session) => setEmail(session.user.email))
        .then(() => setHasEmail(true));
    }

    if (hasEmail) {
      getSession().then((session) => setRank(session.user.rank));
      getSession().then((session) => setLastName(session.user.lastName));
      getSession().then((session) => setSuffix(session.user.suffix));
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

    if (hasEmail && hasTotals) {
      console.log("hasEmail && hasTotals", email, hasTotals);
      setIsLoading(false);
      console.log("totals:", totals);
      var totalArr = JSON.parse(JSON.stringify(totals));
      if (totalArr) {
        setTotalReports(arr.totalReports);
        setQuarterReports(arr.quarterReports);
        duties["total"] = arr.duties;
        conduct["total"] = arr.conduct;
        training["total"] = arr.training;
        teamwork["total"] = arr.teamwork;
        console.log("Duties Object:", duties);
      } else {
        console.log("totalArr empty");
      }
    }

    if (hasEmail && hasReport) {
      console.log("hasEmail && hasReport", email, hasReport);
      console.log("report:", report);
      console.log("Title: ", report[0].title);
      console.log("Category: ", report[0].category);
      console.log("Date: ", report[0].date);
      console.log("Data: ", report[0].report);
    }

    if (hasEmail && hasTotals && hasReport) {
      setIsLoading(false);
    }
  }, [hasEmail, hasTotals, email]);

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
                <Text>Written: {report[0].date}</Text>
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
