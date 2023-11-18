/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState, useMemo } from "react";
import { getSession, useSession } from "next-auth/react";
import {
  AbsoluteCenter,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  Input,
  Select,
  Spinner,
  Button,
  Text,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Dialog from "../NewUser/dialog";
import { createUser } from "src/app/actions/Admin.js";

import secureLocalStorage from "react-secure-storage";
import { getUser, updateUser } from "src/app/actions/User.js";
import { getAllGroups } from "src/app/actions/Group";

const statusMessages = {
  account: "Account not found.",
  confirm: "Confirmation must match password.",
  credentials: "Invalid email or password.",
  duplicate: "An account already exists for this email address.",
  email: "Please enter a valid email address.",
  length: "Password must be a minimum of 8 characters.",
  missingReg: "All fields except suffix and groups are required.",
  missingUpd: "Both New Password and New Password Confirmation are required.",
  invalid: "The entered group name already exist.",
};

export default function User(user_mode) {
  const router = useRouter();
  const { data: session } = useSession();
  const [dialogStatus, setDialogStatus] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [rank, setRank] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [verified, setVerified] = useState(null);

  const [group, setGroup] = useState("");
  const [supervisedGroup, setSupervisedGroup] = useState("");
  const [oldSupervisedGroup, setOldSupervisedGroup] = useState("");
  const [role, setRole] = useState("");

  const [totalReports, setTotalReports] = useState("");
  const [lastReport, setLastReport] = useState("");
  const [lastLogin, setLastLogin] = useState("");
  const [status, setStatus] = useState("");

  const [entry, setEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);

  const [hasEmail, setHasEmail] = useState(false);
  const [email, setEmail] = useState(
    String(secureLocalStorage.getItem("email"))
  );

  const [hasAllGroups, setHasAllGroups] = useState(false);
  const [allGroups, setAllGroups] = useState("");
  const [existingGroups, setExistingGroups] = useState([]);

  const [msg, setMsg] = useState("");

  var state;

  if (user_mode === "View") {
    state = true;
  } else state = false;

  const handleSubmitInfo = (e) => {
    e.preventDefault();
    var tempStatus = "success";

    if (user_mode === "New") {
      let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

      if (supervisedGroup != "" && existingGroups != []) {
        console.log(
          "Comparing " + supervisedGroup + " against existing groups.."
        );
        for (var i = 0; i < existingGroups.length; i++) {
          if (supervisedGroup === existingGroups[i]) {
            tempStatus = "invalid";
          }
        }
      }

      if (
        password === "" ||
        password2 === "" ||
        email === "" ||
        rank === "" ||
        firstName === "" ||
        lastName === "" ||
        role === ""
      ) {
        setMsg(statusMessages.missingReg);
      } else if (password.length < 8) {
        setMsg(statusMessages.length);
      } else if (password !== password2) {
        setMsg(statusMessages.confirm);
      } else if (!emailRegex.test(email)) {
        setMsg(statusMessages.email);
      } else if (tempStatus === "invalid") {
        setMsg(statusMessages.invalid);
      } else {
        createUser({
          email,
          password,
          rank,
          firstName,
          lastName,
          suffix,
          role,
          group: role === "Admin" ? "" : group,
          supervisedGroup: role === "Supervisor" ? supervisedGroup : "",
        }).then((response) => {
          if (!response.ok) {
            response.json().then((data) => {
              if (data === "EXISTS") {
                setMsg(statusMessages.duplicate);
              }
            });
          } else {
            setDialogStatus("New");
          }
        });
      }
    } else if (user_mode === "Edit") {
      console.log("Updating user profile");

      if (supervisedGroup != "" && existingGroups != []) {
        console.log(
          "Comparing " + supervisedGroup + " against existing groups.."
        );
        for (var i = 0; i < existingGroups.length; i++) {
          if (supervisedGroup === existingGroups[i]) {
            tempStatus = "invalid";
          }
        }
        if (supervisedGroup === oldSupervisedGroup) {
          tempStatus = "success";
        }
      }

      if (rank === "" || firstName === "" || lastName === "" || role === "") {
        setMsg("missing");
      } else if (tempStatus === "invalid") {
        setMsg(statusMessages.invalid);
      } else {
        var suspended;
        if (status === "Suspended") suspended = true;
        else suspended = false;
        updateUser({
          email,
          rank,
          firstName,
          lastName,
          suffix,
          role,
          group: role === "Admin" ? "" : group,
          supervisedGroup: role === "Supervisor" ? supervisedGroup : "",
          suspended,
          verified,
        }).then((response) => {
          if (response.ok) {
            {
              setMsg("");
              setDialogStatus("Edit");
            }
          } else {
            alert("User could not be updated. Please try again.");
          }
        });
      }
    }
  };

  useEffect(() => {
    if (session) {
      if (session?.user.role !== "Admin") {
        window.location.replace("/Dashboard/Home");
      }
    }

    if (!hasAllGroups) {
      getAllGroups().then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setAllGroups(response))
              .then(setHasAllGroups(true))
          : setHasError(true);
      });
    }
    if (hasAllGroups) {
      var temp = [];
      var arr = JSON.parse(JSON.stringify(allGroups));
      if (arr) {
        for (var i = 0; i < arr.length; i++) {
          temp.push(arr[i][0]);
        }
        setExistingGroups(temp);
      }
    }
    if (user_mode === "View") {
      if (email !== "" && email !== null) {
        setHasEmail(true);
        console.log("hasEmail:", email);
      } else {
        console.log("email missing");
      }
      if (entry !== null) {
        setHasEntry(true);
        console.log("hasEntry:", entry);
        console.log("hasEntry was set to true");
      }
      if (hasEmail && !hasEntry) {
        console.log("going to call getUser");
        secureLocalStorage.removeItem("email");
        console.log("hasEmail && !hasEntry", email, hasEntry);
        setIsLoading(true);
        setHasError(false);
        if (email === "null") {
          router.push("/Admin/Users");
        } else {
          getUser({ email }).then((response) => {
            response.ok
              ? response
                  .json()
                  .then((response) => setEntry(response))
                  .then(setHasEntry(true))
              : setHasError(true);
          });
        }
      }
      if (hasEmail && hasEntry) {
        console.log("hasEmail && hasEntry", email, hasEntry);
        var arr = JSON.parse(JSON.stringify(entry));
        if (arr) {
          setFirstName(arr.firstName);
          setLastName(arr.lastName);
          setSuffix(arr.suffix);
          setRank(arr.rank);
          setRole(arr.role);
          setGroup(arr.group);
          setSupervisedGroup(arr.supervisedGroup);
          setOldSupervisedGroup(arr.supervisedGroup);
          setTotalReports(arr.totalReports);
          setLastReport(arr.mostRecentReportDate);
          setLastLogin(arr.lastLogin);
          setEmail(arr.email);
          setIsLoading(false);
          setVerified(arr.verified);
          if (arr.suspended === true) {
            setStatus("Suspended");
          } else {
            setStatus("Active");
          }
        }
      }
    }
  }, [
    hasEntry,
    hasEmail,
    email,
    entry,
    hasAllGroups,
    allGroups,
    user_mode,
    router,
  ]);

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
      {session?.user.role == "Admin" && (
        <Box alignContent="left" w={"100%"}>
          <form
            className="flex"
            id="user-form"
            onSubmit={(e) => handleSubmitInfo(e)}
          >
            <HStack>
              <FormControl id="firstName" isRequired>
                <FormLabel mb={1} fontSize={15} color={"black"}>
                  First Name
                </FormLabel>
                <Input
                  isReadOnly={state}
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
                  isReadOnly={state}
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
            </HStack>
            <HStack>
              <FormControl id="suffix">
                <FormLabel mb={1} fontSize={15} color={"black"}>
                  Suffix
                </FormLabel>
                <Input
                  isReadOnly={state}
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
              {state ? (
                <>
                  <FormControl id="rank">
                    <FormLabel mb={1} fontSize={15} color={"black"}>
                      Rank
                    </FormLabel>
                    <Input
                      isReadOnly={state}
                      alpha={"1.0"}
                      variant="trim"
                      borderWidth={"2px"}
                      borderColor={"#70A0AF"}
                      bg="#F7FAFC"
                      mb={3}
                      size={"md"}
                      value={rank}
                    />
                  </FormControl>
                </>
              ) : (
                <FormControl id="rank">
                  <FormLabel mb={1} fontSize={15} color={"black"}>
                    Rank
                  </FormLabel>
                  <Select
                    isReadOnly={state}
                    placeholder="Select Rank"
                    value={rank}
                    variant="trim"
                    borderWidth={"2px"}
                    borderColor={"#70A0AF"}
                    bg="#F7FAFC"
                    mb={3}
                    size={"md"}
                    onChange={(e) => setRank(e.target.value)}
                  >
                    <option value={"AB"}>Airman Basic (AB)</option>
                    <option value={"Amn"}>Airman (Amn)</option>
                    <option value={"A1C"}>Airman First Class (A1C)</option>
                    <option value={"SrA"}>
                      Senior Airman or Sergeant (SrA)
                    </option>
                    <option value={"SSgt"}>Staff Sergeant (SSgt)</option>
                    <option value={"TSgt"}>Technical Sergeant (TSgt)</option>
                    <option value={"MSgt"}>Master Sergeant (MSgt)</option>
                    <option value={"SMSgt"}>
                      Senior Master Sergeant (SMSgt)
                    </option>
                    <option value={"CMSgt"}>
                      Chief Master Sergeant (CMSgt)
                    </option>
                    <option value={"CCM"}>
                      Command Chief Master Sergeant (CCM)
                    </option>
                    <option value={"CMSAF"}>
                      Chief Master Sergeant of the Air Force (CMSAF)
                    </option>
                    <option value={"1st Lt"}>First Lieutenant (1st Lt)</option>
                    <option value={"Capt"}>Captain (Capt)</option>
                    <option value={"Maj"}>Major (Maj)</option>
                    <option value={"Lt Col"}>
                      Lieutenant Colonel (Lt Col)
                    </option>
                    <option value={"Col"}>Colonel (Col)</option>
                    <option value={"Brig Gen"}>
                      Brigadier General (Brig Gen)
                    </option>
                    <option value={"Maj Gen"}>Major General (Maj Gen)</option>
                    <option value={"Lt Gen"}>
                      Lieutenant General (Lt Gen)
                    </option>
                    <option value={"Gen"}>
                      General Air Force Chief of Staff (Gen)
                    </option>
                    <option value={"GOAF"}>
                      General of the Air Force (GOAF)
                    </option>
                  </Select>
                </FormControl>
              )}
            </HStack>
            {user_mode != "Edit" && (
              <FormControl id="email" isRequired>
                <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                  Email
                </FormLabel>
                <Input
                  isReadOnly={state}
                  type=""
                  value={email == "null" ? "" : email}
                  maxLength={64}
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#F7FAFC"
                  mb={3}
                  size={"md"}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
            )}
            {user_mode === "New" && (
              <HStack>
                <FormControl id="password" isRequired>
                  <FormLabel mb={1} fontSize={15} color={"black"}>
                    Temporary Password
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
              </HStack>
            )}
            <HStack>
              {state ? (
                <>
                  <FormControl id="role" isRequired>
                    <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                      Role
                    </FormLabel>
                    <Select
                      isReadOnly={state}
                      alpha={"1.0"}
                      variant="trim"
                      borderWidth={"2px"}
                      borderColor={"#70A0AF"}
                      bg="#F7FAFC"
                      mb={6}
                      size={"md"}
                      value={role}
                    >
                      <option value={"User"} disabled>
                        User
                      </option>
                      <option value={"Supervisor"} disabled>
                        Supervisor
                      </option>
                      <option value={"Admin"} disabled>
                        Admin
                      </option>
                    </Select>
                  </FormControl>
                </>
              ) : (
                <>
                  <FormControl id="role" isRequired>
                    <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                      Role
                    </FormLabel>
                    <Select
                      isReadOnly={state}
                      placeholder="Select Role"
                      variant="trim"
                      borderWidth={"2px"}
                      borderColor={"#70A0AF"}
                      bg="#F7FAFC"
                      mb={6}
                      size={"md"}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value={"User"}>User</option>
                      <option value={"Supervisor"}>Supervisor</option>
                      <option value={"Admin"}>Admin</option>
                    </Select>
                  </FormControl>
                </>
              )}
              {user_mode === "Edit" && (
                <FormControl id="status" isRequired>
                  <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                    Status
                  </FormLabel>
                  <Select
                    isReadOnly={state}
                    placeholder="Select Status"
                    variant="trim"
                    borderWidth={"2px"}
                    borderColor={"#70A0AF"}
                    bg="#F7FAFC"
                    mb={6}
                    size={"md"}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value={"Active"}>Active</option>
                    <option value={"Suspended"}>Suspended</option>
                  </Select>
                </FormControl>
              )}
              {user_mode === "Edit" && (
                <FormControl id="verified" isRequired>
                  <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                    Verified
                  </FormLabel>
                  <Select
                    isReadOnly={state}
                    placeholder="Select Verified Status"
                    variant="trim"
                    borderWidth={"2px"}
                    borderColor={"#70A0AF"}
                    bg="#F7FAFC"
                    mb={6}
                    size={"md"}
                    value={verified}
                    onChange={(e) => setVerified(e.target.value)}
                  >
                    <option value={true}>Verified</option>
                    <option value={false}>Not Verified</option>
                  </Select>
                </FormControl>
              )}
            </HStack>

            <Box display={role === "" || role === "Admin" ? "none" : "initial"}>
              {state ? (
                <>
                  <FormControl id="group">
                    <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                      Membership Group
                    </FormLabel>
                    <Input
                      isReadOnly={state}
                      alpha={"1.0"}
                      variant="trim"
                      borderWidth={"2px"}
                      borderColor={"#70A0AF"}
                      bg="#F7FAFC"
                      mb={6}
                      size={"md"}
                      value={group}
                    />
                  </FormControl>
                </>
              ) : (
                <FormControl id="group">
                  <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                    {user_mode === "New"
                      ? "Assign Membership Group"
                      : "Membership Group"}
                  </FormLabel>
                  <Select
                    isReadOnly={state}
                    placeholder="Select Group"
                    variant="trim"
                    borderWidth={"2px"}
                    borderColor={"#70A0AF"}
                    bg="#F7FAFC"
                    mb={6}
                    size={"md"}
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                  >
                    {existingGroups.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
              <Button
                mb={6}
                display={user_mode === "View" ? "initial" : "none"}
              >
                View Group
              </Button>
            </Box>
            <Box display={role === "Supervisor" ? "initial" : "none"}>
              <FormControl id="supervisedGroup">
                <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                  {user_mode === "New"
                    ? "Assign Managed Group"
                    : "Managed Group"}
                </FormLabel>
                <Input
                  isReadOnly={state}
                  type=""
                  value={supervisedGroup}
                  maxLength={64}
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#F7FAFC"
                  mb={3}
                  size={"md"}
                  onChange={(e) => {
                    setSupervisedGroup(e.target.value);
                    setMsg("");
                  }}
                />
              </FormControl>
              <Button
                mb={6}
                display={user_mode === "View" ? "initial" : "none"}
              >
                View Group
              </Button>
            </Box>

            {state && (
              <>
                <HStack>
                  <FormControl id="totalReports">
                    <FormLabel mb={1} fontSize={15} color={"black"}>
                      Fiscal Total Reports
                    </FormLabel>
                    <Input
                      isReadOnly={state}
                      type=""
                      value={totalReports}
                      maxLength={64}
                      variant="login"
                      borderWidth={"2px"}
                      borderColor={"#70A0AF"}
                      bg="#F7FAFC"
                      mb={3}
                      size={"md"}
                    />
                  </FormControl>
                  <FormControl id="lastReport">
                    <FormLabel mb={1} fontSize={15} color={"black"}>
                      Last Report
                    </FormLabel>
                    <Input
                      isReadOnly={state}
                      type=""
                      value={lastReport}
                      maxLength={64}
                      variant="login"
                      borderWidth={"2px"}
                      borderColor={"#70A0AF"}
                      bg="#F7FAFC"
                      mb={3}
                      size={"md"}
                    />
                  </FormControl>
                </HStack>
                <HStack>
                  <FormControl id="lastLogin">
                    <FormLabel mb={1} fontSize={15} color={"black"}>
                      Last Sign-In
                    </FormLabel>
                    <Input
                      isReadOnly={state}
                      type=""
                      value={lastLogin}
                      maxLength={64}
                      variant="login"
                      borderWidth={"2px"}
                      borderColor={"#70A0AF"}
                      bg="#F7FAFC"
                      mb={3}
                      size={"md"}
                    />
                  </FormControl>
                  <FormControl id="status">
                    <FormLabel mb={1} fontSize={15} color={"black"}>
                      Status
                    </FormLabel>
                    <Input
                      isReadOnly={state}
                      type=""
                      value={status}
                      maxLength={64}
                      variant="login"
                      borderWidth={"2px"}
                      borderColor={"#70A0AF"}
                      bg="#F7FAFC"
                      mb={3}
                      size={"md"}
                    />
                  </FormControl>
                </HStack>
              </>
            )}
          </form>
          {msg}
        </Box>
      )}
      {Dialog(dialogStatus)}
    </>
  );
}
