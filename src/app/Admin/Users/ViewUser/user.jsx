/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState, useMemo } from "react";
import { getSession } from "next-auth/react";
import {
  AbsoluteCenter,
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Spinner,
  Button,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { PiEyeDuotone } from "react-icons/pi";
import Dialog from "../NewUser/dialog";
import secureLocalStorage from "react-secure-storage";

function IndeterminateCheckbox({ indeterminate, className = "", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}

export default function User(user_mode) {
  const router = useRouter();
  const [dialogStatus, setDialogStatus] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [assigned, setAssigned] = useState("");
  const [managed, setManaged] = useState("");
  const [role, setRole] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);

  const [hasUserName, setHasUserName] = useState(false);
  const [userName, setUserName] = useState(
    String(secureLocalStorage.getItem("UserName"))
  );

  const [assignedNotFound, setAssignedNotFound] = useState(null);
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
        setAssignedNotFound(true);
        setSubNotFound(true);
      }
    } else if (user_mode === "Edit") {
      console.log("User updated");
      setDialogStatus("Edit");
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
      <Box alignContent="left" w={"100%"}>
        <form
          className="flex"
          id="user-form"
          onSubmit={(e) => handleSubmitInfo(e)}
        >
          <HStack>
            <FormControl id="name" isRequired>
              <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                Name:
              </FormLabel>
              <Input
                isReadOnly={state}
                type=""
                value={name}
                maxLength={64}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#F7FAFC"
                mb={3}
                size={"md"}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                Email:
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
          </HStack>
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
            <FormControl id="assigned">
              <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                {user_mode === "New" ? "Assign Group:" : "Assigned Group:"}
              </FormLabel>
              <Input
                isReadOnly={state}
                type=""
                value={assigned}
                maxLength={64}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#F7FAFC"
                mb={3}
                size={"md"}
                onChange={(e) => setAssigned(e.target.value)}
              />
            </FormControl>
            <Button mb={6} display={user_mode === "View" ? "initial" : "none"}>
              View Group
            </Button>
            {assignedNotFound && (
              <Text mb={3} color={"gray.600"}>
                This group does not exist. Try again or create group.
              </Text>
            )}
          </Box>
          <Box display={role === "supervisor" ? "initial" : "none"}>
            <FormControl id="managed">
              <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                {user_mode === "New"
                  ? "Assign Subordinate Group:"
                  : "Subordinate Group:"}
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
        </form>
      </Box>
      {Dialog(dialogStatus)}
    </>
  );
}
