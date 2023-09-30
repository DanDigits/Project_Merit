"use client";

import { useState } from "react";
import {
  Card,
  Button,
  ButtonGroup,
  CardBody,
  CardHeader,
  CardFooter,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";
import PasswordDialog from "./PasswordDialog.jsx";

//import { updateUser } from "src/app/actions/User";

export default function UpdatePassword() {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [status, setStatus] = useState(false);

  return (
    <>
      <Card
        p={2}
        alignSelf={"center"}
        size={{ base: "sm", md: "md" }}
        w={{ md: "lg" }}
        bgColor={"white"}
      >
        <CardHeader mb={-5} fontSize={30} color={"black"}>
          Change Password
        </CardHeader>
        <CardBody>
          <div>
            <FormControl id="current">
              <FormLabel mb={1} fontSize={15} color={"black"}>
                Current Password
              </FormLabel>
              <Input
                type="password"
                value={current}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#EDF2F7"
                mb={3}
                size={"md"}
                minLength={8}
                maxLength={32}
                onChange={(e) => setCurrent(e.target.value)}
              />
              <FormErrorMessage>Current password is required.</FormErrorMessage>
            </FormControl>
            <FormControl id="password">
              <FormLabel mb={1} fontSize={15} color={"black"}>
                New Password
              </FormLabel>
              <Input
                type="password"
                value={password}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#EDF2F7"
                mb={3}
                size={"md"}
                minLength={8}
                maxLength={32}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormErrorMessage>Please enter new password.</FormErrorMessage>
            </FormControl>
            <FormControl id="confirmPassword">
              <FormLabel mb={1} fontSize={15} color={"black"}>
                Confirm New Password
              </FormLabel>
              <Input
                type="password"
                value={password2}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#EDF2F7"
                mb={3}
                size={"md"}
                minLength={8}
                maxLength={32}
                onChange={(e) => setPassword2(e.target.value)}
              />
              <FormErrorMessage>
                Password Confirmation is required.
              </FormErrorMessage>
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
              Update
            </Button>
          </ButtonGroup>
        </CardFooter>
        {PasswordDialog(status)}
      </Card>
    </>
  );
}
