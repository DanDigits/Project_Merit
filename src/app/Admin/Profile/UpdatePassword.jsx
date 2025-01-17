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
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";

import { updatePassword } from "src/app/actions/User";

export default function UpdatePassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    getSession().then((session) => setEmail(session.user.email));
    console.log("Email:", email);
  });

  const handleSubmitInfo = (e) => {
    e.preventDefault();

    if (password === "" || newPassword === "" || newPassword2 === "") {
      setStatus("missing");
    } else if (newPassword.length < 8) {
      setStatus("length");
    } else if (password === newPassword) {
      setStatus("nochange");
    } else if (newPassword === newPassword2) {
      updatePassword({ email, password, newPassword }).then((response) => {
        if (response.ok) {
          {
            setStatus("success");
          }
        } else {
          setStatus("old");
        }
      });
    } else {
      setStatus("new");
    }
  };

  return (
    <>
      <Card
        p={{ base: 0, md: 2 }}
        alignSelf={"center"}
        size={{ base: "sm", md: "lg" }}
        w={{ base: "100%", lg: "lg" }}
        bgColor={"white"}
      >
        <CardHeader mb={-5} fontSize={30} color={"black"}>
          Change Password
        </CardHeader>
        <CardBody>
          <div>
            <FormControl id="password">
              <FormLabel mb={1} fontSize={15} color={"black"}>
                Current Password
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
              <FormErrorMessage>Current password is required.</FormErrorMessage>
            </FormControl>
            <FormControl id="newPassword">
              <FormLabel mb={1} fontSize={15} color={"black"}>
                New Password
              </FormLabel>
              <Input
                type="password"
                value={newPassword}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#EDF2F7"
                mb={3}
                size={"md"}
                minLength={8}
                maxLength={32}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <FormErrorMessage>Please enter new password.</FormErrorMessage>
            </FormControl>
            <FormControl id="newPassword2">
              <FormLabel mb={1} fontSize={15} color={"black"}>
                Confirm New Password
              </FormLabel>
              <Input
                type="password"
                value={newPassword2}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#EDF2F7"
                mb={3}
                size={"md"}
                minLength={8}
                maxLength={32}
                onChange={(e) => setNewPassword2(e.target.value)}
              />
              <FormErrorMessage>
                Password Confirmation is required.
              </FormErrorMessage>
            </FormControl>
            {status === "new" && <p>Confirmation must match new password.</p>}
            {status === "success" && <p>Password Updated</p>}
            {status === "old" && <p>Current password is incorrect.</p>}
            {status === "missing" && <p>All fields are required.</p>}
            {status === "length" && (
              <p>New password must be a minimum of 8 characters.</p>
            )}
            {status === "nochange" && (
              <p>New password is the same as current password.</p>
            )}
          </div>
        </CardBody>
        <CardFooter>
          <ButtonGroup>
            <Button
              bgColor={"#6abbc4"}
              color={"white"}
              _hover={{ bgColor: "#031926", color: "white" }}
              form="report-form"
              type="submit"
              onClick={(e) => handleSubmitInfo(e)}
            >
              Update
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </>
  );
}
