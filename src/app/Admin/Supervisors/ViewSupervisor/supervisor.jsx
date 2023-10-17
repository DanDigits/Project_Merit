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
  Icon,
  Spinner,
  Button,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { PiEyeDuotone } from "react-icons/pi";
import Dialog from "../NewSupervisor/dialog";
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

export default function Supervisor(sup_mode) {
  const router = useRouter();
  const [dialogStatus, setDialogStatus] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [group, setGroup] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);

  const [hasSupervisorName, setHasSupervisorName] = useState(false);
  const [supervisorName, setSupervisorName] = useState(
    String(secureLocalStorage.getItem("SupervisorName"))
  );

  var state;

  if (sup_mode === "View") {
    state = true;
    console.log(supervisorName);
  } else state = false;

  const handleSubmitInfo = (e) => {
    e.preventDefault();
    if (sup_mode === "New") {
      console.log("new supervisor assigned");
      setDialogStatus("New");
    } else if (sup_mode === "Edit") {
      console.log("supervisor updated");
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
          id="sup-form"
          onSubmit={(e) => handleSubmitInfo(e)}
        >
          <FormControl id="name" isRequired>
            <FormLabel mb={1} fontSize={15} color={"#331E38"}>
              Supervisor Name:
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
          <FormControl id="group" isRequired>
            <FormLabel mb={1} fontSize={15} color={"#331E38"}>
              Assigned Group:
            </FormLabel>
            <Input
              isReadOnly={state}
              type=""
              value={group}
              maxLength={64}
              variant="login"
              borderWidth={"2px"}
              borderColor={"#70A0AF"}
              bg="#F7FAFC"
              mb={3}
              size={"md"}
              onChange={(e) => setGroup(e.target.value)}
            />
          </FormControl>
        </form>
      </Box>
      {Dialog(dialogStatus)}
    </>
  );
}
