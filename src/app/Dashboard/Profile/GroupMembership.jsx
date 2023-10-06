"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import {
  Card,
  Button,
  ButtonGroup,
  CardBody,
  CardHeader,
  CardFooter,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import GroupDialog from "./GroupDialog.jsx";
import { getGroup } from "src/app/actions/Reports";

export default function UpdatePassword() {
  const [email, setEmail] = useState("");
  const [hasEmail, setHasEmail] = useState("");
  const [group, setGroup] = useState("");
  const [hasGroup, setHasGroup] = useState("");
  const [leader, setLeader] = useState("");
  const [hasError, setHasError] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (!hasEmail) {
      setIsLoading(true);
      setHasError(false);
      getSession()
        .then((session) => setEmail(session.user.email))
        .then(() => setHasEmail(true));
    }
    if (hasEmail && !hasGroup) {
      setIsLoading(true);
      setHasError(false);
      getGroup({ email }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setGroup(response))
              .then(setHasGroup(true))
          : setHasError(true);
        console.log("hasError:", hasError);
      });
    }
    if (hasEmail && hasGroup) {
      var arr = JSON.parse(JSON.stringify(group));
      if (arr) {
        setGroup(arr.group);
        setLeader(arr.leader);
        setIsLoading(false);
      }
    }
  }, [hasEmail, hasGroup, email, group, hasError, isLoading]);

  return (
    <>
      {GroupDialog(status)}
      <Card
        p={2}
        alignSelf={"center"}
        size={{ base: "sm", md: "md" }}
        w={{ md: "lg" }}
        bgColor={"white"}
      >
        <CardHeader mb={-5} fontSize={30} color={"black"}>
          Group Membership
        </CardHeader>
        <CardBody>
          <div>
            <FormControl id="membership">
              <FormLabel mb={1} fontSize={15} color={"black"}>
                Group Name
              </FormLabel>
              <Input
                isReadOnly
                type=""
                value={group}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#EDF2F7"
                mb={3}
                size={"md"}
                minLength={8}
                maxLength={32}
              />
            </FormControl>
            <FormControl id="membership">
              <FormLabel mb={1} fontSize={15} color={"black"}>
                Group Leader
              </FormLabel>
              <Input
                isReadOnly
                type=""
                value={leader}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#EDF2F7"
                mb={3}
                size={"md"}
                minLength={8}
                maxLength={32}
              />
            </FormControl>
          </div>
        </CardBody>
        <CardFooter>
          <ButtonGroup>
            <Button
              bgColor={"#70A0AF"}
              color={"white"}
              _hover={{ bgColor: "#706993", color: "white" }}
              form="report-form"
              type="submit"
              onClick={() => setStatus(true)}
            >
              Leave Group
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </>
  );
}
