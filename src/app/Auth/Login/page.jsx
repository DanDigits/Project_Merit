"use client";

import { useState } from "react";
import {
  Card,
  Text,
  Button,
  CardBody,
  CardHeader,
  CardFooter,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";

import { signIn } from "next-auth/react";
import { signUp } from "src/app/actions/User";

export default function Page() {
  const [mode, setMode] = useState("Login");
  const [rank, setRank] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmitInfo = (e) => {
    e.preventDefault();

    setStatus("");

    if (mode === "Register") {
      if (
        password === "" ||
        password2 === "" ||
        email === "" ||
        rank === "" ||
        firstName === "" ||
        lastName === ""
      ) {
        setStatus("missingReg");
      } else if (password.length < 8) {
        setStatus("length");
      } else if (password !== password2) {
        setStatus("confirm");
      } else {
        signUp({
          email,
          password,
          rank,
          firstName,
          lastName,
          suffix,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.status);
            } else {
              setMode("Login");
            }
          })
          .catch((error) => {
            console.log("error: " + error);
          });
      }
    } else if (mode === "Login") {
      if (email === "" || password === "") {
        setStatus("missingLog");
      } else {
        signIn("credentials", {
          email: email,
          password: password,
          callbackUrl: "/Dashboard/Home",
          redirect: false,
        })
          .then((response) => {
            if (!response.ok) {
              console.log(response);
              setStatus("credentials");
            } else {
              console.log(response);
            }
          })
          .catch((error) => {
            console.log("error: " + error);
            if (error === "Invalid Credentials") {
              setStatus("credentials");
            }
          });
      }
    }
  };

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
          {mode}
        </CardHeader>
        <CardBody>
          {mode === "Login" && (
            <div>
              <FormControl id="email" isRequired>
                <FormLabel mb={1} fontSize={15} color={"black"}>
                  Email
                </FormLabel>
                <Input
                  variant="login"
                  borderWidth={"2px"}
                  bg="#F7FAFC"
                  borderColor={"#70A0AF"}
                  mb={3}
                  size={"md"}
                  type="email"
                  value={email}
                  maxLength={255}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel mb={1} fontSize={15} color={"black"}>
                  Password
                </FormLabel>
                <Input
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#F7FAFC"
                  size={"md"}
                  type="password"
                  minLength={8}
                  maxLength={64}
                  mb={3}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
            </div>
          )}
          {mode === "Register" && (
            <div>
              <FormControl id="rank" isRequired>
                <FormLabel mb={1} fontSize={15} color={"black"}>
                  Rank
                </FormLabel>
                <Select
                  placeholder="Select Rank"
                  value={rank}
                  variant="trim"
                  borderColor={"#70A0AF"}
                  borderWidth={"2px"}
                  mb={3}
                  size={"md"}
                  onChange={(e) => setRank(e.target.value)}
                >
                  <option value={"AB"}>Airman Basic (AB)</option>
                  <option value={"Amn"}>Airman (Amn)</option>
                  <option value={"A1C"}>Airman First Class (A1C)</option>
                  <option value={"SrA"}>Senior Airman or Sergeant (SrA)</option>
                  <option value={"SSgt"}>Staff Sergeant (SSgt)</option>
                  <option value={"TSgt"}>Technical Sergeant (TSgt)</option>
                  <option value={"MSgt"}>Master Sergeant (MSgt)</option>
                  <option value={"SMSgt"}>
                    Senior Master Sergeant (SMSgt)
                  </option>
                  <option value={"CMSgt"}>Chief Master Sergeant (CMSgt)</option>
                  <option value={"CCM"}>
                    Command Chief Master Sergeant (CCM)
                  </option>
                  <option value={"CMSAF"}>
                    Chief Master Sergeant of the Air Force (CMSAF)
                  </option>
                  <option value={"1st Lt"}>First Lieutenant (1st Lt)</option>
                  <option value={"Capt"}>Captain (Capt)</option>
                  <option value={"Maj"}>Major (Maj)</option>
                  <option value={"Lt Col"}>Lieutenant Colonel (Lt Col)</option>
                  <option value={"Col"}>Colonel (Col)</option>
                  <option value={"Brig Gen"}>
                    Brigadier General (Brig Gen)
                  </option>
                  <option value={"Maj Gen"}>Major General (Maj Gen)</option>
                  <option value={"Lt Gen"}>Lieutenant General (Lt Gen)</option>
                  <option value={"Gen"}>
                    General Air Force Chief of Staff (Gen)
                  </option>
                  <option value={"GOAF"}>
                    General of the Air Force (GOAF)
                  </option>
                </Select>
              </FormControl>
              <FormControl id="firstName" isRequired>
                <FormLabel mb={1} fontSize={15} color={"black"}>
                  First Name
                </FormLabel>
                <Input
                  type=""
                  value={firstName}
                  maxLength={64}
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#F7FAFC"
                  mb={3}
                  size={"md"}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <FormErrorMessage>First Name is required.</FormErrorMessage>
              </FormControl>
              <FormControl id="lastName" isRequired>
                <FormLabel mb={1} fontSize={15} color={"black"}>
                  Last Name
                </FormLabel>
                <Input
                  type=""
                  value={lastName}
                  maxLength={64}
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#F7FAFC"
                  mb={3}
                  size={"md"}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <FormErrorMessage>Last Name is required.</FormErrorMessage>
              </FormControl>
              <FormControl id="suffix">
                <FormLabel mb={1} fontSize={15} color={"black"}>
                  Suffix
                </FormLabel>
                <Input
                  type=""
                  value={suffix}
                  maxLength={6}
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#F7FAFC"
                  mb={3}
                  size={"md"}
                  onChange={(e) => setSuffix(e.target.value)}
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel mb={1} fontSize={15} color={"black"}>
                  Email
                </FormLabel>
                <Input
                  type="email"
                  value={email}
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#F7FAFC"
                  mb={3}
                  size={"md"}
                  maxLength={255}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormErrorMessage>Email is required.</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel mb={1} fontSize={15} color={"black"}>
                  Password
                </FormLabel>
                <Input
                  type="password"
                  value={password}
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#F7FAFC"
                  mb={3}
                  size={"md"}
                  minLength={8}
                  maxLength={32}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormErrorMessage>Password is required.</FormErrorMessage>
              </FormControl>
              <FormControl id="confirmPassword" isRequired>
                <FormLabel mb={1} fontSize={15} color={"black"}>
                  Confirm Password
                </FormLabel>
                <Input
                  type="password"
                  value={password2}
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#F7FAFC"
                  mb={3}
                  size={"md"}
                  minLength={8}
                  maxLength={32}
                  onChange={(e) => setPassword2(e.target.value)}
                />
                <FormErrorMessage>
                  Password confirmation is required.
                </FormErrorMessage>
              </FormControl>
            </div>
          )}
          {status === "missingReg" && (
            <p>All fields except suffix are required.</p>
          )}
          {status === "missingLog" && <p>Email and password are required.</p>}
          {status === "credentials" && <p>Invalid email or password.</p>}
          {status === "confirm" && <p>Confirmation must match password.</p>}
          {status === "email" && <p>Please enter a valid email address.</p>}
          {status === "length" && (
            <p>Password must be a minimum of 8 characters.</p>
          )}
        </CardBody>
        <CardFooter>
          <VStack align={"left"} w={"100%"}>
            <Button
              onClick={(e) => handleSubmitInfo(e)}
              bgColor={"#38a4b1"}
              color={"white"}
              _hover={{ bgColor: "#031926", color: "white" }}
            >
              {mode === "Login" ? (
                <Text align={"center"}>Log In</Text>
              ) : (
                <Text align={"center"}>Sign Up</Text>
              )}
            </Button>
          </VStack>
        </CardFooter>
      </Card>
      <VStack>
        {mode === "Login" ? (
          <Text align={"center"}>Need an account?</Text>
        ) : (
          <Text align={"center"}>Already have an account?</Text>
        )}
        <Button
          mb={"10"}
          color={"#031926"}
          w={"sm"}
          variant={"link"}
          alignSelf={"center"}
          onClick={() => {
            setMode(mode === "Login" ? "Register" : "Login");
          }}
        >
          {mode === "Login" ? "Register" : "Login"}
        </Button>
      </VStack>
    </>
  );
}
