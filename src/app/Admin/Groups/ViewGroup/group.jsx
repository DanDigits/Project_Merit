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
import GroupUsers from "./groupusers";
import { PiEyeDuotone } from "react-icons/pi";
import Dialog from "../NewGroup/dialog";
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

export default function Group(group_mode) {
  const router = useRouter();
  const [dialogStatus, setDialogStatus] = useState(false);
  const [name, setName] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [supEmail, setSupEmail] = useState("");
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);

  const [hasGroupName, setHasGroupName] = useState(false);
  const [groupName, setGroupName] = useState(
    String(secureLocalStorage.getItem("groupName"))
  );

  var state;

  if (group_mode === "View") {
    state = true;
    console.log(groupName);
  } else state = false;

  const handleView = (email) => {
    console.log(email);
  };

  const handleSubmitInfo = (e) => {
    e.preventDefault();
    if (group_mode === "New") {
      console.log("new group created");
      setDialogStatus("New");
    } else if (group_mode === "Edit") {
      console.log("group updated");
      setDialogStatus("Edit");
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "user",
        header: () => "Name",
      },
      {
        accessorKey: "email",
        header: () => "Email",
      },
      {
        id: "view",
        header: "View",
        cell: ({ cell }) => (
          <>
            <Button
              size={{ base: "sm", lg: "md" }}
              textColor={"white"}
              bg={"#1c303c"}
              opacity={0.85}
              borderColor={"#354751"}
              borderWidth={"thin"}
              _hover={{ color: "black", bg: "white", opacity: 1 }}
              onClick={() => handleView(cell.row.original.email)}
            >
              <Icon as={PiEyeDuotone} />
            </Button>
          </>
        ),
      },
    ],
    []
  );
  const data = useMemo(
    () => [
      {
        user: "user1",
        email: "user1@gmail.com",
      },
      {
        user: "user2",
        email: "user2@gmail.com",
      },
      {
        user: "user3",
        email: "user3@gmail.com",
      },
    ],
    []
  );

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
          id="group-form"
          onSubmit={(e) => handleSubmitInfo(e)}
        >
          <FormControl id="name" isRequired>
            <FormLabel mb={1} fontSize={15} color={"#331E38"}>
              Group Name:
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
          <FormControl
            display={group_mode === "New" ? "none" : "initial"}
            id="supervisor"
          >
            <FormLabel mb={1} fontSize={15} color={"#331E38"}>
              Supervisor:
            </FormLabel>
            <Input
              isReadOnly={state}
              type=""
              value={supervisor}
              maxLength={64}
              variant="login"
              borderWidth={"2px"}
              borderColor={"#70A0AF"}
              bg="#F7FAFC"
              mb={3}
              size={"md"}
              onChange={(e) => setSupervisor(e.target.value)}
            />
          </FormControl>
          <FormControl id="supEmail">
            <FormLabel mb={1} fontSize={15} color={"#331E38"}>
              Supervisor Email:
            </FormLabel>
            <Input
              isReadOnly={state}
              type=""
              value={supEmail}
              maxLength={64}
              variant="login"
              borderWidth={"2px"}
              borderColor={"#70A0AF"}
              bg="#F7FAFC"
              mb={3}
              size={"md"}
              onChange={(e) => setSupEmail(e.target.value)}
            />
          </FormControl>
          <>
            {group_mode === "View" && (
              <>
                <FormControl id="total" isRequired>
                  <FormLabel mb={1} fontSize={15} color={"#331E38"}>
                    Total Members:
                  </FormLabel>
                  <Input
                    isReadOnly={state}
                    type=""
                    value={total}
                    maxLength={64}
                    variant="login"
                    borderWidth={"2px"}
                    borderColor={"#70A0AF"}
                    bg="#F7FAFC"
                    mb={3}
                    size={"md"}
                    onChange={(e) => setTotal(e.target.value)}
                  />
                </FormControl>
              </>
            )}
          </>
          <>
            {(group_mode === "View" || group_mode === "Edit") && (
              <>
                <Text fontWeight={"semibold"} fontSize={15} color={"#331E38"}>
                  Group Members:
                </Text>
                <GroupUsers mode={group_mode} columns={columns} data={data} />
              </>
            )}
          </>
        </form>
      </Box>
      {Dialog(dialogStatus)}
    </>
  );
}
