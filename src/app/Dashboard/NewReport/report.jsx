/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { createReport, updateReport } from "./../../actions/Report.js";
import Dialog from "./dialog.jsx";

export default function Report(report_mode) {
  const [createStatus, setCreateStatus] = useState(false);
  const [title, setTitle] = useState("");
  const [quarter, setQuarter] = useState(1);
  const [date, setDate] = useState(""); // needs to default to current date
  const [report, setReport] = useState("");
  const [email, setEmail] = useState("");
  const [reportId, setReportId] = useState("");
  //const [data, setData] = useState("");
  var state;

  //temp
  /* must get report id somehow
  setData(getReport(reportId));
  */

  if (report_mode === "View") {
    state = true;
  } else state = false;

  useEffect(() => {
    getSession().then((session) => setEmail(session.user.email));
  }, []);

  const handleSubmitInfo = (e) => {
    e.preventDefault();
    if (report_mode === "New") {
      createReport({ title, email, date, quarter, report }).then((response) => {
        if (response.ok) {
          {
            setCreateStatus(true);
          }
        } else {
          alert("Report could not be created. Please try again.");
        }
      });
    } else if (report_mode === "Edit") {
      updateReport(reportId, title, email, date, quarter, report).then(() => {
        alert("Successfully updated the report.");
        setMode("View");
      });
    }
  };

  return (
    <>
      <form
        className="flex"
        id="report-form"
        onSubmit={(e) => handleSubmitInfo(e)}
      >
        <FormControl id="title" isRequired>
          <FormLabel mb={1} fontSize={15} color={"#331E38"}>
            Title
          </FormLabel>
          <Input
            isDisabled={state}
            type=""
            value={title}
            maxLength={64}
            variant="login"
            borderWidth={"2px"}
            borderColor={"#70A0AF"}
            bg="#ECECEC"
            mb={3}
            size={"md"}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <HStack mb="3">
          <FormControl id="quarter" isRequired>
            <FormLabel mb={1} fontSize={15} color={"#331E38"}>
              Quarter
            </FormLabel>
            <Select
              isDisabled={state}
              defaultValue={1}
              placeholder="Select Quarter"
              variant="login"
              borderWidth={"2px"}
              borderColor={"#70A0AF"}
              bg="#ECECEC"
              mb={3}
              size={"md"}
              onChange={(e) => setQuarter(e.target.value)}
            >
              <option value={1}>1st Quarter</option>
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
              isDisabled={state}
              type="date"
              value={date}
              variant="login"
              borderWidth={"2px"}
              borderColor={"#70A0AF"}
              bg="#ECECEC"
              mb={3}
              size={"md"}
              onChange={(e) => setDate(e.target.value)}
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
              <div>Here are some quick tips for effective bullet points:</div>
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
              isDisabled={state}
              placeholder="What would you like to report?"
              type="text"
              varient="outline"
              maxLength={500}
              variant="login"
              borderWidth={"2px"}
              borderColor={"#70A0AF"}
              bg="#ECECEC"
              mb={3}
              size={"md"}
              width={{ base: "100%", md: "lg" }}
              value={report}
              onChange={(e) => setReport(e.target.value)}
            />
          </FormControl>
        </VStack>
      </form>
      {Dialog(createStatus)}
    </>
  );
}
