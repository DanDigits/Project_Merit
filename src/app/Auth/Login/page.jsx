"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
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
import { signIn, getSession, useSession } from "next-auth/react";
import {
  signUp,
  requestReset,
  resetPassword,
  resendRequest,
} from "src/app/actions/User";

const statusMessages = {
  account: "Account not found.",
  confirm: "Confirmation must match password.",
  credentials: "Invalid email or password.",
  duplicate: "Account already exists.",
  email: "Please enter a valid email address.",
  expired: "This link has expired. Please request a new link.",
  invalid: "Link is either expired or invalid. Please create new request.",
  length: "Password must be a minimum of 8 characters.",
  missingLog: "Email and password are required.",
  missingReg: "All fields except suffix are required.",
  missingUpd: "Both New Password and New Password Confirmation are required.",
  sent: "Request sent, please check your email. This link is only valid for 15 minutes. ",
  suspended:
    "This account has been locked. Please contact the system administrator.",
  verified: "Account successfully verified.",
};

export default function Page() {
  /**
   * mode controls which view is displayed: Login, Register, Reset Password, Update Password, Verification Needed
   * status displays preset notifications such as when fields are missing, invalid credentials, expired link, etc
   * expired is set when an expired link viewed (passed by url param)
   * verified is set when a account verification link is successfully loaded
   * registered is set when an a new account is successfully created
   * updated is set when a password is successfully updated
   * duplicate is set when a use tries to create an accoung with an existing email address
   * num is part of the verification link use for password reset (passed by url param)
   * params is the paramaters pulled from the url in the case of verification links and password reset links
   */
  const { data: session } = useSession();
  const [mode, setMode] = useState("Login");
  const [status, setStatus] = useState("");
  const [expired, setExpired] = useState("");
  const [verified, setVerified] = useState("");
  const [updated, setUpdated] = useState("");
  const [registered, setRegistered] = useState("");
  const [duplicate, setDuplicate] = useState("");
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
  const [role, setRole] = useState("");

  /**
   * Parameters pulled from the url
   * urlNum is a userId
   * urlExpired indicates that a verification link expired
   * urlVerified indicates success or failure of account verification
   */

  const urlNum = params.get("num");
  const urlExpired = params.get("expired");
  const urlVerified = params.get("verified");

  /**
   * Resets params so that messages do not persist when switching views.
   */
  const resetParams = () => {
    setRegistered("");
    setVerified("");
    setExpired("");
    setDuplicate("");
  };

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
    if (session) {
      setRole(session?.user.role);
      if (role != "" && role === "Admin") {
        window.location.replace("/Admin/Users");
      } else {
        window.location.replace("/Dashboard/Home");
      }
    }

    console.log("urlVerified: " + urlVerified);
    if (urlNum && mode !== "Verification Needed" && !updated) {
      setNum(urlNum);
      setMode("Update Password");
    }

    if (urlExpired === "true") {
      setMode("Verification Needed");
      setExpired("expired");
    }

    if (urlVerified === "true") {
      setVerified("verified");
      console.log("set verified true");
    }

    if (urlVerified === "false") {
      setVerified("error");
      console.log("set verified false");
    }

    console.log("verified: ", verified);
    console.log("mode: " + mode);

    setStatus("");
  }, [mode, role, session]);

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

    document.getElementById("submitButton").disabled = true;
    setTimeout(function () {
      document.getElementById("submitButton").disabled = false;
    }, 5000);

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
        setStatus(statusMessages.missingReg);
      } else if (password.length < 8) {
        setStatus(statusMessages.length);
      } else if (password !== password2) {
        setStatus(statusMessages.confirm);
      } else if (!emailRegex.test(email)) {
        setStatus(statusMessages.email);
      } else {
        signUp({
          email,
          password,
          rank,
          firstName,
          lastName,
          suffix,
        }).then((response) => {
          if (!response.ok) {
            response.json().then((data) => {
              if (data === "EXISTS") {
                setDuplicate(true);
              }
            });
          } else {
            setRegistered(true);
            setVerified("");
            setExpired("");
          }
        });
      }
    }

    /**
     * Login
     */
    if (mode === "Login") {
      if (email === "" || password === "") {
        setStatus(statusMessages.missingLog);
      } else {
        signIn("credentials", {
          email: email,
          password: password,
          redirect: false,
        }).then((response) => {
          if (!response.ok) {
            console.log(response);
            if (response.error === "Invalid credentials") {
              setStatus(statusMessages.credentials);
            } else if (response.error === "Unverified account") {
              setMode("Verification Needed");
            } else if (response.error === "Suspended account") {
              setStatus(statusMessages.suspended);
            }
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
        setStatus(statusMessages.email);
      } else {
        requestReset({ email }).then((response) => {
          if (response.ok) {
            {
              console.log(response);
              console.log("Email sent");
              setStatus(statusMessages.sent);
            }
          } else {
            setStatus(statusMessages.account);
          }
        });
      }
    }

    /**
     * Update Password
     */
    if (mode === "Update Password") {
      if (newPassword === "" || password2 === "") {
        setStatus(statusMessages.missingUpd);
      } else if (newPassword.length < 8) {
        setStatus(statusMessages.length);
      } else if (newPassword !== password2) {
        setStatus(statusMessages.confirm);
      } else {
        resetPassword({ num, newPassword }).then((response) => {
          if (response.ok) {
            {
              setUpdated("success");
            }
          } else {
            setStatus(statusMessages.invalid);
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
        setStatus(statusMessages.email);
      } else {
        resendRequest({ email }).then((response) => {
          if (response.ok) {
            {
              console.log(response);
              console.log("Email sent");
              setStatus(statusMessages.sent);
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
        {verified === "verified" && (
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Account Verified!
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Login to start using Project Merit.
            </AlertDescription>
          </Alert>
        )}
        {updated === "success" && (
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Password Updated
            </AlertTitle>
          </Alert>
        )}
        {verified === "error" && (
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Account Verification Failed
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Please contact systems administrator.
            </AlertDescription>
          </Alert>
        )}
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
              {expired === "expired" ? (
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
          {status}
        </CardBody>
        <CardFooter>
          <VStack align={"left"} w={"100%"}>
            {mode !== "Reset Successful" &&
              mode !== "Verification Needed" &&
              updated !== "success" && (
                <Button
                  id={"submitButton"}
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
            {updated === "success" && (
              <Button
                onClick={() => window.location.replace("/Auth/Login")}
                bgColor={"#38a4b1"}
                color={"white"}
                _hover={{ bgColor: "#031926", color: "white" }}
              >
                <Text align={"center"}>Log In</Text>
              </Button>
            )}
            {mode === "Verification Needed" && (
              <Button
                id={"submitButton"}
                onClick={(e) => handleSubmitInfo(e)}
                bgColor={"#38a4b1"}
                color={"white"}
                _hover={{ bgColor: "#031926", color: "white" }}
              >
                <Text align={"center"}>Resend Verification Email</Text>
              </Button>
            )}
            {registered && (
              <Alert
                status="success"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
              >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  Account Created!
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                  Please check your email to verify your account.
                </AlertDescription>
              </Alert>
            )}
            {duplicate && (
              <Alert
                status="warning"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
              >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  Account Found
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                  This email is already registered.
                </AlertDescription>
              </Alert>
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
                window.location.replace("/Auth/Login");
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
              resetParams();
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
