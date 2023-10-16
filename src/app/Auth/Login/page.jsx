"use client";

import { useEffect, useState } from "react";
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
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  signUp,
  requestReset,
  resetPassword,
  resendRequest,
} from "src/app/actions/User";

export default function Page() {
  /**
   * mode controls which view is displayed: Login, Register, Reset Password, Update Password, Verification Needed
   * status displays preset notifications such as when fields are missing, invalid credentials, expired link, etc
   * expired is set when an expired link viewed (passed by url param)
   * num is part of the verification link use for password reset (passed by url param)
   * params is the paramaters pulled from the url in the case of verification links and password reset links
   */
  const [mode, setMode] = useState("Login");
  const [status, setStatus] = useState("");
  const [expired, setExpired] = useState("");
  const [num, setNum] = useState("");
  const params = useSearchParams();

  /**
   * Form fields used for login, register, reset password, update password, etc
   */
  const [rank, setRank] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /**
   * Use Effect checks to see if a verification or password reset link is being used
   * and clears status messages on mode changes.
   *
   * Params should only be present in the url when loading an account verification link
   * or password reset link.
   *
   * If the url params contains expired=true the user will be sent to the verification
   * screen and notified that the link has expired.
   *
   * Status is cleared every time a mode changes.
   */
  useEffect(() => {
    var urlNum = params.get("num");

    if (urlNum && mode !== "Verification Needed") {
      setNum(urlNum);
      setMode("Update Password");
    }

    var urlExpired = params.get("expired");

    if (urlExpired) {
      setMode("Verification Needed");
      setExpired(true);
    }

    setStatus("");
  }, [mode]);

  /**
   * This section handles all form submissions sorted by mode.
   *
   * Status is cleared whenever a form is submitted.
   *
   * Register:
   * When register form is submitted all fields are required except for suffix.
   * The email field is checked to ensure it is a valid email format.
   *
   * Login:
   * When the login form is submitted all fields are required.
   * The email field is checked to ensure it is a valid email format.
   *
   * Reset Password:
   * Sends an email with a password reset link to the email address provided.
   * The email field is checked to ensure it is a valid email format.
   *
   * Update Password:
   * This view only loads with a valid, non-expired, password reset link.
   * Both newPassword and password2 must be present, match, and be a
   * minimum of 8 character long.
   *
   * Validation Needed:
   * This view loads when either a user tries to login with an unvalidated account
   * or uses an expired link. It prompts them to send a request for a new validation
   * email.
   *
   */
  const handleSubmitInfo = (e) => {
    e.preventDefault();

    setStatus("");

    /**
     * Register
     */
    if (mode === "Register") {
      let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

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
      } else if (!emailRegex.test(email)) {
        setStatus("email");
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
    }

    /**
     * Login
     */
    if (mode === "Login") {
      if (email === "" || password === "") {
        setStatus("missingLog");
      } else {
        signIn("credentials", {
          email: email,
          password: password,
          redirect: false,
        }).then((response) => {
          if (!response.ok) {
            console.log(response);
            if (response.error === "Invalid credentials") {
              setStatus("credentials");
            } else if (response.error === "Unverified account") {
              setMode("Verification Needed");
            }
          } else {
            window.location.replace("/Dashboard/Home");
            console.log(response);
          }
        });
      }
    }

    /**
     * Reset Password
     */
    if (mode === "Reset Password") {
      let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

      if (email === "" || !emailRegex.test(email)) {
        setStatus("email");
      } else {
        requestReset({ email }).then((response) => {
          if (response.ok) {
            {
              console.log(response);
              console.log("Email sent");
              setStatus("sent");
            }
          } else {
            setStatus("account");
          }
        });
      }
    }

    /**
     * Update Password
     */
    if (mode === "Update Password") {
      if (newPassword === "" || password2 === "") {
        setStatus("missing");
      } else if (newPassword.length < 8) {
        setStatus("length");
      } else if (newPassword !== password2) {
        setStatus("confirm");
      } else {
        resetPassword({ num, newPassword }).then((response) => {
          if (response.ok) {
            {
              setMode("Reset Successful");
            }
          } else {
            setStatus("invalid");
          }
        });
      }
    }

    /**
     * Verification Needed
     */
    if (mode === "Verification Needed") {
      let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

      if (email === "" || !emailRegex.test(email)) {
        setStatus("email");
      } else {
        resendRequest({ email }).then((response) => {
          if (response.ok) {
            {
              console.log(response);
              console.log("Email sent");
              setStatus("sent");
            }
          } else {
            alert("Request failed, please try again.");
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
          {mode === "Reset Password" && (
            <div>
              <Text align={"center"}>
                Instructions to reset your password will be sent to the email
                provided.
              </Text>
              <FormControl id="email">
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
            </div>
          )}
          {mode === "Update Password" && (
            <div>
              <FormControl id="newPassword" isRequired>
                <FormLabel mb={1} fontSize={15} color={"black"}>
                  New Password
                </FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#F7FAFC"
                  mb={3}
                  size={"md"}
                  minLength={8}
                  maxLength={32}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <FormErrorMessage>Password is required.</FormErrorMessage>
              </FormControl>
              <FormControl id="confirmPassword" isRequired>
                <FormLabel mb={1} fontSize={15} color={"black"}>
                  Confirm New Password
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
          {mode === "Verification Needed" && (
            <div>
              {expired ? (
                <div>
                  <Text align={"center"}>
                    This link is no longer valid. Please request a new link.
                  </Text>
                  <br />
                </div>
              ) : (
                <Text align={"center"}>
                  Please check your email for a verification link. If you have
                  not received an email, please use the form below to make
                  another request.
                </Text>
              )}
              <FormControl id="email">
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
            </div>
          )}
          {status === "missingReg" && (
            <p>All fields except suffix are required.</p>
          )}
          {status === "missingLog" && <p>Email and password are required.</p>}
          {status === "account" && <p>Account not found.</p>}
          {status === "credentials" && <p>Invalid email or password.</p>}
          {status === "expired" && (
            <p>This link has expired. Please request a new link.</p>
          )}
          {status === "confirm" && <p>Confirmation must match password.</p>}
          {status === "email" && <p>Please enter a valid email address.</p>}
          {status === "length" && (
            <p>Password must be a minimum of 8 characters.</p>
          )}
          {status === "invalid" && (
            <p>Link is either expired or invalid. Please create new request.</p>
          )}
          {status === "sent" && (
            <div>
              <p>Request sent, please check your email.</p>
              <p>This link is only valid for 15 minutes.</p>
            </div>
          )}
        </CardBody>
        <CardFooter>
          <VStack align={"left"} w={"100%"}>
            {mode !== "Reset Successful" && mode !== "Verification Needed" && (
              <Button
                onClick={(e) => handleSubmitInfo(e)}
                bgColor={"#38a4b1"}
                color={"white"}
                _hover={{ bgColor: "#031926", color: "white" }}
              >
                {mode === "Login" && <Text align={"center"}>Log In</Text>}
                {mode === "Register" && <Text align={"center"}>Sign Up</Text>}
                {mode === "Reset Password" && (
                  <Text align={"center"}>{mode}</Text>
                )}
                {mode === "Update Password" && (
                  <Text align={"center"}>{mode}</Text>
                )}
              </Button>
            )}
            {mode === "Login" && (
              <Button
                color={"#031926"}
                variant={"link"}
                onClick={() => {
                  setMode("Reset Password");
                }}
              >
                Forgot Password
              </Button>
            )}
            {mode === "Reset Successful" && (
              <Button
                onClick={() => setMode("Login")}
                bgColor={"#38a4b1"}
                color={"white"}
                _hover={{ bgColor: "#031926", color: "white" }}
              >
                <Text align={"center"}>Log In</Text>
              </Button>
            )}
            {mode === "Verification Needed" && (
              <Button
                onClick={(e) => handleSubmitInfo(e)}
                bgColor={"#38a4b1"}
                color={"white"}
                _hover={{ bgColor: "#031926", color: "white" }}
              >
                <Text align={"center"}>Resend Verification Email</Text>
              </Button>
            )}
          </VStack>
        </CardFooter>
      </Card>
      <VStack>
        {mode === "Login" && <Text align={"center"}>Need an account?</Text>}
        {mode === "Register" && (
          <Text align={"center"}>Already have an account?</Text>
        )}
        {mode === "Verification Needed" && (
          <Text align={"center"}>Ready to try again?</Text>
        )}
        {(mode === "Update Password" || mode === "Reset Password") && (
          <div>
            <Text align={"center"}>Change your mind?</Text>
            <Button
              mb={"10"}
              color={"#031926"}
              w={"sm"}
              variant={"link"}
              alignSelf={"center"}
              onClick={() => {
                setMode("Login");
              }}
            >
              Login
            </Button>
          </div>
        )}
        {(mode === "Login" || mode === "Register") && (
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
        )}
        {mode === "Verification Needed" && (
          <Button
            mb={"10"}
            color={"#031926"}
            w={"sm"}
            variant={"link"}
            alignSelf={"center"}
            onClick={() => {
              window.location.replace("/Auth/Login");
            }}
          >
            Login
          </Button>
        )}
      </VStack>
    </>
  );
}
