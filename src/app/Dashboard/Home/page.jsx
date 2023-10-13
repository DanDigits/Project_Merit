"use client";
import {
  Card,
  CardHeader,
  CardBody,
  AbsoluteCenter,
  Spinner,
  SimpleGrid,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { Stack, Heading } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { getLastReport, getTotals } from "./../../actions/Report.js";
import StatusBox from "./statusBox";

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
    report: "",
  });

  const [hasTotals, setHasTotals] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totals, setTotals] = useState({
    totalReports: "",
    currentQuarter: "",
    quarterReports: "",
    Duties: "",
    Conduct: "",
    Training: "",
    Teamwork: "",
  });

  const [duties] = useState({
    catagory: "Primary / Additional Duties",
    shorten: "duties",
    total: 0,
    needed: 5,
  });
  const [conduct] = useState({
    catagory: "Standards, Conduct, Character & Military Bearings",
    shorten: "conduct",
    total: 0,
    needed: 3,
  });
  const [training] = useState({
    catagory: "Training Requirements",
    shorten: "training",
    total: 0,
    needed: 3,
  });
  const [teamwork] = useState({
    catagory: "Teamwork / Fellowership",
    shorten: "teamwork",
    total: 0,
    needed: 3,
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
      console.log("totals", totals);
      console.log("Fiscal Year: ", totals.totalReports);
      console.log("Current Quarter: ", totals.currentQuarter);
      console.log("Quarter Total: ", totals.quarterReports);
      console.log("Duties: ", totals.Duties);
      console.log("Conduct: ", totals.Conduct);
      console.log("Training: ", totals.Training);
      console.log("Teamwork: ", totals.Teamwork);

      if (totals.Duties !== "") {
        duties.total = totals.Duties;
      }

      if (totals.Conduct !== "") {
        conduct.total = totals.Conduct;
      }

      if (totals.Training !== "") {
        training.total = totals.Training;
      }

      if (totals.Teamwork !== "") {
        teamwork.total = totals.Teamwork;
      }
      setProgress(
        (totals.totalReports /
          (duties.needed +
            conduct.needed +
            training.needed +
            teamwork.needed)) *
          100
      );
      console.log("Progress: ", progress);
    }

    if (hasEmail && hasReport) {
      console.log("hasEmail && hasReport", email, hasReport);
      console.log("report:", report);
      console.log("Title: ", report.title);
      console.log("Category: ", report.category);
      console.log("Date: ", report.date);
      console.log("Data: ", report.report);
    }

    if (hasEmail && hasTotals && hasReport) {
      setIsLoading(false);
    }
  }, [hasEmail, hasTotals, hasReport, email, report, totals]);

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
          p={{ base: 0, md: 2 }}
          mx={{ base: -4, md: 0 }}
          alignSelf={"center"}
          size={{ base: "sm", md: "lg" }}
          w={{ md: "100%" }}
          bgColor={"white"}
        >
          <CardHeader p={3} align={"center"}>
            <Heading fontSize={{ base: "xl", md: "3xl" }}>
              Dashboard for {rank} {lastName} {suffix}
            </Heading>
          </CardHeader>
          <Stack m="2vh">
            <Card
              bgColor={"#ffffff"}
              borderColor={"#72bfc8"}
              borderWidth={"thin"}
              boxShadow={"md"}
              size={{ base: "sm", md: "xl" }}
              w={{ base: "100%", lg: "initial" }}
              variant={"outline"}
              align-contents={"center"}
              alignSelf={"center"}
            >
              <CardBody
                align-contents={"center"}
                alignSelf={{ base: "left", md: "center" }}
                py={{ base: "1", md: "3" }}
              >
                <SimpleGrid
                  columns={{ base: 1, md: 3 }}
                  spacing={{ base: 0, md: 6 }}
                >
                  <Stat>
                    <SimpleGrid
                      alignItems={"baseline"}
                      columns={{ base: 2, md: 1 }}
                    >
                      <StatLabel>Fiscal Year Total</StatLabel>
                      <StatNumber
                        justifySelf={{ base: "flex-end", md: "auto" }}
                        fontSize={{ base: "lg", lg: "2xl" }}
                      >
                        {totals.totalReports}
                      </StatNumber>
                      <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                        Oct 1 - Sept 30
                      </StatHelpText>
                    </SimpleGrid>
                  </Stat>
                  <Stat>
                    <SimpleGrid
                      alignItems={"baseline"}
                      columns={{ base: 2, md: 1 }}
                    >
                      <StatLabel>Quarter Total</StatLabel>
                      <StatNumber
                        justifySelf={{ base: "flex-end", md: "auto" }}
                        fontSize={{ base: "lg", lg: "2xl" }}
                      >
                        {totals.quarterReports}
                      </StatNumber>
                      <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                        Quarter {totals.currentQuarter}
                      </StatHelpText>
                    </SimpleGrid>
                  </Stat>
                  <Stat>
                    <SimpleGrid
                      alignItems={"baseline"}
                      columns={{ base: 2, md: 1 }}
                    >
                      <StatLabel>Most Recent</StatLabel>
                      <StatNumber
                        justifySelf={{ base: "flex-end", md: "auto" }}
                        fontSize={{ base: "lg", lg: "2xl" }}
                      >
                        {report.date}
                      </StatNumber>
                      <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                        Report Date
                      </StatHelpText>
                    </SimpleGrid>
                  </Stat>
                </SimpleGrid>
              </CardBody>
            </Card>
            <b>Progress</b>
            <Progress
              hasStripe
              size={"lg"}
              color={"#72bfc8"}
              colorScheme="teal"
              borderWidth={"thin"}
              mb={3}
              value={progress}
            />
            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              spacing={{ base: 4, md: 6 }}
            >
              <StatusBox content={duties}></StatusBox>
              <StatusBox content={teamwork}></StatusBox>
              <StatusBox content={training}></StatusBox>
              <StatusBox content={conduct}></StatusBox>
            </SimpleGrid>
          </Stack>
        </Card>
      )}
    </>
  );
}
