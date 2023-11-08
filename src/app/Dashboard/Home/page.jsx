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
import { getUser } from "./../../actions/User.js";
import { getLastReport, getTotals } from "./../../actions/Report.js";
import StatusBox from "./statusBox";

export default function Page() {
  const [hasEmail, setHasEmail] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [profile, setProfile] = useState("");
  const [email, setEmail] = useState("");
  const [rank, setRank] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    Mission: "",
    Leadership: "",
    Resources: "",
    Unit: "",
  });

  const [mission] = useState({
    category: "Executing the Mission",
    shorten: "mission",
    total: 0,
    needed: 3,
  });
  const [leadership] = useState({
    category: "Leading People",
    shorten: "leadership",
    total: 0,
    needed: 3,
  });
  const [resources] = useState({
    category: "Managing Resources",
    shorten: "resources",
    total: 0,
    needed: 3,
  });
  const [unit] = useState({
    category: "Improving the Unit",
    shorten: "unit",
    total: 0,
    needed: 3,
  });

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

    if (hasEmail && !hasTotals && !isLoading) {
      console.log("Fetching totals");
      setIsLoading(true);
      setHasError(false);

      getTotals({ email }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setTotals(response))
              .then(setHasTotals(true))
              .then(console.log("Got totals"))
          : setTotals({ date: "N/A" });
      });
      setIsLoading(false);
      if (hasError) {
        console.log("Error fetching totals");
      }
    }

    if (hasEmail && !hasReport && !isLoading) {
      console.log("Fetching report");
      setIsLoading(true);
      setHasError(false);

      getLastReport({ email }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setReport(response))
              .then(setHasReport(true))
              .then(console.log("Got report"))
          : setHasError(true);
      });
      setIsLoading(false);
      if (hasError) {
        console.log("Error fetching report");
      }
    }

    if (hasProfile && hasTotals && hasReport) {
      setDashboard();
    }
  }, [hasEmail, hasProfile, hasReport, hasTotals, totals]);

  function setDashboard() {
    console.log("Setting Dashboard");
    if (totals.Mission !== "") {
      mission.total = totals.Mission;
    }

    if (totals.Leadership !== "") {
      leadership.total = totals.Leadership;
    }

    if (totals.Resources !== "") {
      resources.total = totals.Resources;
    }

    if (totals.Unit !== "") {
      unit.total = totals.Unit;
    }

    setProgress(
      (totals.totalReports /
        (mission.needed + leadership.needed + resources.needed + unit.needed)) *
        100
    );

    if (!report.date) {
      setReport({ date: "N/A" });
    }

    var arr = JSON.parse(JSON.stringify(profile));
    if (arr) {
      setRank(arr.rank);
      setLastName(arr.lastName);
      setSuffix(arr.suffix);
    }

    console.log("Dashboard set");
  }

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
              <StatusBox content={mission}></StatusBox>
              <StatusBox content={leadership}></StatusBox>
              <StatusBox content={resources}></StatusBox>
              <StatusBox content={unit}></StatusBox>
            </SimpleGrid>
          </Stack>
        </Card>
      )}
    </>
  );
}
