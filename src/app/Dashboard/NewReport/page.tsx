"use client";
/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  ButtonGroup,
  Card,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
//import { createReport } from "src/app/actions/Report";
import { useEffect } from "react";
import { getSession } from "next-auth/react";
import { revalidateTag } from "next/cache";
import { addReport } from "./../../../../actions/serverActions";
import { Report } from "./../../../../typings";

export default async function Page() {
  const [sessionEmail, setSessionEmail] = useState("");

  useEffect(() => {
    getSession().then((session) => setSessionEmail(session.user.email));
  }, []);

  const res = await fetch(process.env.DB_URI, {
    cache: "no-cache",
    next: {
      tags: ["reports"],
    },
  });

  const reports: Report[] = await res.json();

  revalidateTag("reports");

  return (
    <>
      <Card
        p={2}
        alignSelf={"center"}
        size={{ base: "sm", md: "lg" }}
        w={'{ md: "lg" }'}
        bgColor={"white"}
      >
        <VStack m="5vh">
          <Heading color="#331E38">Create New Report</Heading>
          <br />
          <div className="flex">
            <form action={addReport}>
              <FormControl id="title" isRequired>
                <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                  Title
                </FormLabel>
                <Input
                  name="title"
                  maxLength={64}
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#ECECEC"
                  mb={3}
                  size={"md"}
                />
              </FormControl>
              <HStack mb="3">
                <FormControl id="quarter" isRequired>
                  <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                    Quarter
                  </FormLabel>
                  <Select
                    placeholder="1st Quarter"
                    name="quarter"
                    defaultValue={1}
                    variant="login"
                    borderWidth={"2px"}
                    borderColor={"#70A0AF"}
                    bg="#ECECEC"
                    mb={3}
                    size={"md"}
                  >
                    <option value={2}>2nd Quarter</option>
                    <option value={3}>3rd Quarter</option>
                    <option value={4}>4th Quarter</option>
                  </Select>
                </FormControl>
                <FormControl id="date" isRequired>
                  <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                    Date
                  </FormLabel>
                  <Input
                    name="date"
                    variant="login"
                    borderWidth={"2px"}
                    borderColor={"#70A0AF"}
                    bg="#ECECEC"
                    mb={3}
                    size={"md"}
                  />
                </FormControl>
              </HStack>
              <br />
              <Accordion allowToggle>
                <AccordionItem borderColor="purple.300">
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        Guidelines
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel outlineColor={"#331E38"} pb={4}>
                    <div>
                      Here are some quick tips for effective bullet points:
                    </div>
                    <div>Tip 1: This is a tip</div>
                    <div>Tip 2: This is another time</div>
                    <div>Tip 3: Still another tip</div>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              <br />
              <VStack>
                <FormControl id="report" isRequired>
                  <Textarea
                    placeholder="What would you like to report?"
                    name="report"
                    //varient="outline"
                    maxLength={500}
                    variant="login"
                    borderWidth={"2px"}
                    borderColor={"#70A0AF"}
                    bg="#ECECEC"
                    mb={3}
                    size={"md"}
                    width={{ base: "100%", md: "lg" }}
                  />
                </FormControl>
              </VStack>
              <ButtonGroup>
                <Link href="/Dashboard/Home">
                  <Button
                    bgColor={"#A0C1B9"}
                    color={"#331E38"}
                    _hover={{ bgColor: "#706993", color: "white" }}
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  bgColor={"#70A0AF"}
                  color={"white"}
                  _hover={{ bgColor: "#706993", color: "white" }}
                >
                  Submit
                </Button>
              </ButtonGroup>
            </form>
          </div>
        </VStack>
        <h2 className="font-bold p-5">List of Reports</h2>
        <div className="flex flex-wrap gap-5">
          {reports.map((report) => (
            <div key={report.id} className="p-5 shadow">
              <p>{report.title}</p>
              <p>{report.quarter}</p>
              <p>{report.date}</p>
              <p>{report.report}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
