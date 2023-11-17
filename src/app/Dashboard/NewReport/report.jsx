/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import {
  AbsoluteCenter,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Spinner,
  Switch,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import {
  createReport,
  getReport,
  updateReport,
} from "./../../actions/Report.js";
import Dialog from "./dialog.jsx";
import { useRouter } from "next/navigation";

import secureLocalStorage from "react-secure-storage";
import Thesaurus from "./thesaurus";

export default function Report(report_mode) {
  const router = useRouter();
  const { data: session } = useSession();
  const [dialogStatus, setDialogStatus] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [longCategory, setLongCategory] = useState("");
  const [date, setDate] = useState(""); // needs to default to current date
  const [report, setReport] = useState("");
  const [email, setEmail] = useState("");
  const [entry, setEntry] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);
  const [hasReportId, setHasReportId] = useState(false);
  const [reportId, setReportId] = useState(
    String(secureLocalStorage.getItem("reportID"))
  );

  var state;

  if (report_mode === "View") {
    state = true;
  } else state = false;

  useEffect(() => {
    getSession().then((session) => setEmail(session.user.email));

    if (session) {
      if (session?.user.role === "Admin") {
        window.location.replace("/Admin/Users");
      }
    }

    if (report_mode === "View") {
      if (reportId !== "" && reportId !== null) {
        setHasReportId(true);
        console.log("hasReportId:", reportId);
      } else {
        console.log("reportId missing");
      }
      if (entry !== null) {
        setHasEntry(true);
        console.log("hasEntry:", entry);
      }
      if (hasReportId && !hasEntry) {
        secureLocalStorage.removeItem("reportID");
        console.log("hasReportId && !hasEntry", reportId, hasEntry);
        setIsLoading(true);
        setHasError(false);
        if (reportId == "null") {
          router.push("/Dashboard/Reports");
        } else {
          getReport({ reportId }).then((response) => {
            response.ok
              ? response
                  .json()
                  .then((response) => setEntry(response))
                  .then(setHasEntry(true))
              : setHasError(true);
          });
        }
      }
      if (hasReportId && hasEntry) {
        console.log("hasReportId && hasEntry", reportId, hasEntry);
        var arr = JSON.parse(JSON.stringify(entry));
        if (arr) {
          setTitle(arr.title);
          setCategory(arr.category);
          setDate(arr.date);
          setReport(arr.report);
          setIsLoading(false);

          if (arr.category === "Mission") {
            setLongCategory("Executing the Mission");
          } else if (arr.category === "Leadership") {
            setLongCategory("Leading People");
          } else if (arr.category === "Resources") {
            setLongCategory("Managing Resources");
          } else if (arr.category === "Unit") {
            setLongCategory("Improving the Unit");
          } else {
            setLongCategory(arr.category);
          }

          console.log("Long Category: ", longCategory);
        }
      }
    }
  }, [
    hasEntry,
    hasReportId,
    reportId,
    entry,
    report_mode,
    router,
    longCategory,
    session,
  ]);

  const handleSubmitInfo = (e) => {
    e.preventDefault();
    if (report_mode === "New") {
      createReport({ title, email, date, category, report }).then(
        (response) => {
          if (response.ok) {
            {
              setDialogStatus("New");
            }
          } else {
            alert("Report could not be created. Please try again.");
          }
        }
      );
    } else if (report_mode === "Edit") {
      updateReport({ reportId, title, email, date, category, report }).then(
        (response) => {
          if (response.ok) {
            {
              setDialogStatus("Edit");
            }
          } else {
            alert("Report could not be updated. Please try again.");
          }
        }
      );
    }
  };

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
            isReadOnly={state}
            type=""
            value={title}
            maxLength={64}
            variant="login"
            borderWidth={"2px"}
            borderColor={"#70A0AF"}
            bg="#F7FAFC"
            mb={3}
            size={"md"}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <HStack mb="3">
          {state ? (
            <>
              <FormControl id="category" isRequired>
                <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                  Category
                </FormLabel>
                <Select
                  minW={{ md: "xs", lg: "sm" }}
                  isReadOnly={state}
                  alpha={"1.0"}
                  variant="trim"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#F7FAFC"
                  mb={3}
                  size={"md"}
                  value={category}
                >
                  <option value={"Mission"} disabled>
                    Executing the Mission
                  </option>
                  <option value={"Leadership"} disabled>
                    Leading People
                  </option>
                  <option value={"Resources"} disabled>
                    Managing Resources
                  </option>
                  <option value={"Unit"} disabled>
                    Improving the Unit
                  </option>
                </Select>
              </FormControl>
            </>
          ) : (
            <>
              <FormControl id="category" isRequired>
                <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                  Category
                </FormLabel>
                <Select
                  minW={{ md: "xs", lg: "sm" }}
                  isReadOnly={state}
                  placeholder="Select Category"
                  variant="trim"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#F7FAFC"
                  mb={3}
                  size={"md"}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value={"Mission"}>Executing the Mission</option>
                  <option value={"Leadership"}>Leading People</option>
                  <option value={"Resources"}>Managing Resources</option>
                  <option value={"Unit"}>Improving the Unit</option>
                </Select>
              </FormControl>
            </>
          )}
          <FormControl id="date" isRequired>
            <FormLabel mb={1} fontSize={15} color={"#331E38"}>
              Date
            </FormLabel>
            <Input
              isReadOnly={state}
              type="date"
              value={date}
              variant="login"
              borderWidth={"2px"}
              borderColor={"#70A0AF"}
              bg="#F7FAFC"
              mb={3}
              size={"md"}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>
        </HStack>
        <FormControl display="flex" alignItems="center" htmlFor="thesaurus">
          <FormLabel mb="0">Enable thesaurus?</FormLabel>
          <Switch
            name={"thesaurus"}
            id={"thesaurusSwitch"}
            isReadOnly={state}
            colorScheme={"cyan"}
            onChange={(e) => setToggle(!toggle)}
          />
        </FormControl>
        {toggle && (
          <>
            <Thesaurus />
          </>
        )}
        <br />
        <VStack>
          <FormControl id="report" isRequired>
            <FormLabel mb={1} fontSize={15} color={"#331E38"}>
              Report
            </FormLabel>
            <Textarea
              isReadOnly={state}
              placeholder="What would you like to report?"
              type="text"
              varient="outline"
              variant="trim"
              borderWidth={"2px"}
              borderColor={"#70A0AF"}
              bg="#F7FAFC"
              mb={3}
              size={"md"}
              width="100%"
              value={report}
              onChange={(e) => setReport(e.target.value)}
            />
          </FormControl>
        </VStack>
      </form>
      {Dialog(dialogStatus)}
    </>
  );
}
