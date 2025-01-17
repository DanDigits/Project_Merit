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
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUser } from "./../../actions/User.js";
import StatusBox from "./statusBox";

export default function Page() {
  const { data: session } = useSession();
  const [hasEmail, setHasEmail] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [profile, setProfile] = useState("");
  const [email, setEmail] = useState("");
  const [rank, setRank] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reportDate, setReportDate] = useState("");
  const [totals, setTotals] = useState({
    totalReports: "",
    currentQuarter: "",
    quarterReports: "",
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

  function calculate(completed, needed) {
    var percentage = completed / needed;
    if (percentage > 1) percentage = 1;
    return percentage;
  }

  const setDashboard = useCallback(() => {
    console.log("Setting Dashboard");
    console.log("Profile: ", profile);
    var arr = JSON.parse(JSON.stringify(profile));

    if (arr) {
      setRank(arr.rank);
      setLastName(arr.lastName);
      setSuffix(arr.suffix);
      setTotals({
        totalReports: arr.totalReports,
        currentQuarter: arr.currentQuarter,
        quarterReports: arr.quarterReports,
      });

      if (totals.Mission !== "") {
        mission.total = arr.Mission;
      }

      if (totals.Leadership !== "") {
        leadership.total = arr.Leadership;
      }

      if (totals.Resources !== "") {
        resources.total = arr.Resources;
      }

      if (totals.Unit !== "") {
        unit.total = arr.Unit;
      }

      if (arr.mostRecentReportDate == 0) {
        setReportDate("N/A");
      } else {
        setReportDate(arr.mostRecentReportDate);
      }

      setProgress(
        calculate(
          calculate(mission.total, mission.needed) +
            calculate(resources.total, resources.needed) +
            calculate(leadership.total, leadership.needed) +
            calculate(unit.total, unit.needed),
          4
        ) * 100
      );
    }
  }, [
    leadership,
    mission,
    profile,
    resources,
    totals.Leadership,
    totals.Mission,
    totals.Resources,
    totals.Unit,
    unit,
  ]);

  useEffect(() => {
    if (session) {
      if (session?.user.role === "Admin") {
        window.location.replace("/Admin/Users");
      }
    }

    if (!hasEmail && !isLoading) {
      setIsLoading(true);
      setHasError(false);
      console.log("Fetching email...");
      setEmail(session?.user.email);
      if (email && email != "") {
        setHasEmail(true);
      }
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

    if (hasEmail && hasProfile && reportDate == "") {
      setDashboard();
    }
  }, [
    session,
    hasEmail,
    isLoading,
    hasProfile,
    email,
    hasError,
    reportDate,
    setDashboard,
  ]);

  return (
    <>
      {isLoading && (
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
      )}
      {session?.user.role !== "Admin" && (
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
                        {reportDate}
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
