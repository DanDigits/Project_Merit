/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState, useMemo } from "react";
import { getSession } from "next-auth/react";
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
//import { createUser, getUser, updateUser } from "";
import secureLocalStorage from "react-secure-storage";

export default function User(user_mode) {
  const router = useRouter();
  const [dialogStatus, setDialogStatus] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [rank, setRank] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [membership, setMembership] = useState("");
  const [managed, setManaged] = useState("");
  const [role, setRole] = useState("user");
  const [entry, setEntry] = useState("");
  const totalReports = 0;
  const lastReport = "2023-10-10";
  const lastSignIn = "2023-10-10";
  const status = "active";

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);

  const [hasUserName, setHasUserName] = useState(false);
  const [userName, setUserName] = useState(
    String(secureLocalStorage.getItem("UserName"))
  );

  const [membershipNotFound, setMembershipNotFound] = useState(null);
  const [subNotFound, setSubNotFound] = useState(null);

  var state;

  if (user_mode === "View") {
    state = true;
    console.log(userName);
  } else state = false;

  const handleSubmitInfo = (e) => {
    e.preventDefault();
    if (user_mode === "New") {
      console.log("new user created");
      var response = "no";
      if (response === "ok") {
        setDialogStatus("New");
      } else {
        setMembershipNotFound(true);
        setSubNotFound(true);
      }
    } else if (user_mode === "Edit") {
      console.log("User updated");
      setDialogStatus("Edit");
    }
  };

  useEffect(() => {
    if (user_mode === "View") {
      if (userName !== "" && userName !== null) {
        setHasUserName(true);
        console.log("hasUserName:", userName);
      } else {
        console.log("username missing");
      }
      if (entry !== null) {
        setHasEntry(true);
        console.log("hasEntry:", entry);
      }
      if (hasUserName && !hasEntry) {
        secureLocalStorage.removeItem("UserName");
        console.log("hasusername && !hasEntry", userName, hasEntry);
        setIsLoading(true);
        setHasError(false);
        if (userName == "null") {
          router.push("/Admin/Users");
        } else {
          getUser({ userName }).then((response) => {
            response.ok
              ? response
                  .json()
                  .then((response) => setEntry(response))
                  .then(setHasEntry(true))
              : setHasError(true);
          });
        }
      }
      if (hasUserName && hasEntry) {
        console.log("hasusename && hasEntry", userName, hasEntry);
        var arr = JSON.parse(JSON.stringify(entry));
        if (arr) {
          setName(arr.name);
          setEmail(arr.email);
          setIsLoading(false);
        }
      }
    }
  }, [hasEntry, hasUserName, userName, entry, user_mode, router]);

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
                    type=""
                    value={rank}
                    maxLength={64}
                    variant="login"
                    borderWidth={"2px"}
                    borderColor={"#70A0AF"}
                    bg="#EDF2F7"
                    mb={3}
                    size={"md"}
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
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#EDF2F7"
                  mb={3}
                  size={"md"}
                  _hover={{ bgColor: "#706993" }}
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
                value={email}
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
          {state ? (
            <>
              <FormControl id="role" isRequired>
                <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                  Role
                </FormLabel>
                <Select
                  isReadOnly={state}
                  alpha={"1.0"}
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#F7FAFC"
                  mb={6}
                  size={"md"}
                  value={role}
                >
                  <option value={"user"}>User</option>
                  <option value={"supervisor"}>Supervisor</option>
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
                  placeholder="Select Category"
                  variant="login"
                  borderWidth={"2px"}
                  borderColor={"#70A0AF"}
                  bg="#F7FAFC"
                  mb={6}
                  size={"md"}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value={"user"}>User</option>
                  <option value={"supervisor"}>Supervisor</option>
                </Select>
              </FormControl>
            </>
          )}
          <Box display={!role || role === null ? "none" : "initial"}>
            <FormControl id="membership">
              <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                {user_mode === "New"
                  ? "Assign Membership Group"
                  : "Membership Group"}
              </FormLabel>
              <Input
                isReadOnly={state}
                type=""
                value={membership}
                maxLength={64}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#F7FAFC"
                mb={3}
                size={"md"}
                onChange={(e) => setMembership(e.target.value)}
              />
            </FormControl>
            <Button mb={6} display={user_mode === "View" ? "initial" : "none"}>
              View Group
            </Button>
            {membershipNotFound && (
              <Text mb={3} color={"gray.600"}>
                This group does not exist. Try again or create group.
              </Text>
            )}
          </Box>
          <Box display={role === "supervisor" ? "initial" : "none"}>
            <FormControl id="managed">
              <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                {user_mode === "New" ? "Assign Managed Group" : "Managed Group"}
              </FormLabel>
              <Input
                isReadOnly={state}
                type=""
                value={managed}
                maxLength={64}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#F7FAFC"
                mb={3}
                size={"md"}
                onChange={(e) => setManaged(e.target.value)}
              />
            </FormControl>
            <Button display={user_mode === "View" ? "initial" : "none"}>
              View Group
            </Button>
            {subNotFound && (
              <Text mb={3} color={"gray.600"}>
                This group does not exist. Try again or create group.
              </Text>
            )}
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
                <FormControl id="lastSignIn">
                  <FormLabel mb={1} fontSize={15} color={"black"}>
                    Last Sign-In
                  </FormLabel>
                  <Input
                    isReadOnly={state}
                    type=""
                    value={lastSignIn}
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
      </Box>
      {Dialog(dialogStatus)}
    </>
  );
}
