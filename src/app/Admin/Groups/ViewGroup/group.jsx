/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  AbsoluteCenter,
  Box,
  FormControl,
  FormLabel,
  Input,
  Icon,
  Spinner,
  Button,
  Text,
} from "@chakra-ui/react";
import { PiEyeDuotone } from "react-icons/pi";
import { useRouter } from "next/navigation";
import Dialog from "../NewGroup/dialog";
//import { createGroup, getGroup, updateGroup } from "";

import GroupUsers from "./groupusers";
//import { getGroup, updateGroup } from "";
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
  const [supervisor, setSupervisor] = useState("");
  const [supEmail, setSupEmail] = useState("");
  const [total, setTotal] = useState(0);

  const [entry, setEntry] = useState(null);
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
  } else state = false;

  const handleView = useCallback(
    (email) => {
      secureLocalStorage.setItem("Email", email);
      router.push("/Admin/Users/ViewUser");
    },
    [router]
  );

  const handleSubmitInfo = (e) => {
    e.preventDefault();
    if (group_mode === "New") {
      /*createGroup({ groupName, supEmail }).then(
        (response) => {
          if (response.ok) {
            {
              setDialogStatus("New");
            }
          } else {
            alert("Group could not be created. Please try again.");
          }
        }
      );*/
    } else if (group_mode === "Edit") {
      /*updateGroup({ groupName, supEmail }).then(
        (response) => {
          if (response.ok) {
            {
              setDialogStatus("Edit");
            }
          } else {
            alert("Group could not be updated. Please try again.");
          }
        }
      );*/
    }
  };

  useEffect(() => {
    if (group_mode === "View") {
      if (groupName !== "" && groupName !== null) {
        setHasGroupName(true);
        console.log("hasGroupName:", groupName);
      } else {
        console.log("groupname missing");
      }
      if (entry !== null) {
        setHasEntry(true);
        console.log("hasEntry:", entry);
      }
      if (hasGroupName && !hasEntry) {
        secureLocalStorage.removeItem("groupName");
        console.log("hasgroupname && !hasEntry", groupName, hasEntry);
        setIsLoading(true);
        setHasError(false);
        if (groupName == "null") {
          router.push("/Admin/Groups");
        } else {
          getGroup({ groupName }).then((response) => {
            response.ok
              ? response
                  .json()
                  .then((response) => setEntry(response))
                  .then(setHasEntry(true))
              : setHasError(true);
          });
        }
      }
      if (hasGroupName && hasEntry) {
        console.log("hasReportId && hasEntry", groupName, hasEntry);
        var arr = JSON.parse(JSON.stringify(entry));
        if (arr) {
          setGroupName(arr.groupName);
          setSupEmail(arr.supEmail);
          setSupervisor(arr.supervisor);
          setTotal(arr.total);
          setIsLoading(false);
        }
      }
    }
  }, [hasEntry, hasGroupName, groupName, entry, group_mode, router]);

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
      {
        accessorKey: "lastName",
        header: () => "Last Name",
      },
      {
        accessorKey: "firstName",
        header: () => "First Name",
      },
      {
        accessorKey: "suffix",
        header: () => "Suffix",
      },
      {
        accessorKey: "rank",
        header: () => "Rank",
      },
      {
        accessorKey: "email",
        header: () => "Email",
      },
    ],
    []
  );
  const data = useMemo(
    () => [
      {
        firstName: "user1",
        email: "user1@gmail.com",
      },
      {
        firstName: "user2",
        email: "user2@gmail.com",
      },
      {
        firstName: "user3",
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
          <FormControl id="groupName" isRequired>
            <FormLabel mb={1} fontSize={15} color={"#331E38"}>
              Group Name:
            </FormLabel>
            <Input
              isReadOnly={state}
              type=""
              value={groupName}
              maxLength={64}
              variant="login"
              borderWidth={"2px"}
              borderColor={"#70A0AF"}
              bg="#F7FAFC"
              mb={3}
              size={"md"}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </FormControl>
          <FormControl
            display={group_mode === "View" ? "initial" : "none"}
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
                <FormControl id="total">
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
                  />
                </FormControl>
              </>
            )}
          </>
          <>
            {group_mode != "New" && (
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
