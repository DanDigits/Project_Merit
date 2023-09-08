/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  VStack,
  HStack,
  Input,
  FormControl,
  FormLabel,
  Select,
  Textarea,
} from "@chakra-ui/react";

export default function ReportPreview() {
  const [title, setTitle] = useState("");
  const [quarter, setQuarter] = useState("");
  const [date_of_creation, setDate] = useState(""); // needs to default to current date
  const [report, setReport] = useState("");

  return (
    <div className="flex">
      <FormControl id="title" isReadOnly>
        <FormLabel mb={1} fontSize={15} color={"#331E38"}>
          Title
        </FormLabel>
        <Input
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
        <FormControl id="quarter" isDisabled>
          <FormLabel mb={1} fontSize={15} color={"#331E38"}>
            Quarter
          </FormLabel>
          <Select
            placeholder="1st Quarter"
            value={quarter}
            defaultValue={1}
            variant="login"
            borderWidth={"2px"}
            borderColor={"#70A0AF"}
            bg="#ECECEC"
            mb={3}
            size={"md"}
            onChange={(e) => setQuarter(e.target.value)}
          >
            <option value={2}>2nd Quarter</option>
            <option value={3}>3rd Quarter</option>
            <option value={4}>4th Quarter</option>
          </Select>
        </FormControl>
        <FormControl id="date" isReadOnly>
          <FormLabel mb={1} fontSize={15} color={"#331E38"}>
            Date
          </FormLabel>
          <Input
            type="date"
            value={date_of_creation}
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
        <FormControl id="report" isReadOnly>
          <Textarea
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
            onChange={(e) => setReport(e.target.value)}
          />
        </FormControl>
      </VStack>
    </div>
  );
}
