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
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [longCategory, setLongCategory] = useState("");
  const [date, setDate] = useState(""); // needs to default to current date
  const [report, setReport] = useState("");
  const [email, setEmail] = useState("");
  const [entry, setEntry] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);
  const [hasReportId, setHasReportId] = useState(false);

  var state;

  if (group_mode === "View") {
    state = true;
  } else state = false;

  const handleSubmitInfo = (e) => {
    e.preventDefault();
    if (group_mode === "New") {
      console.log("new group created");
    } else if (group_mode === "Edit") {
      console.log("group updated");
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
              onClick={() => handleSubmitInfo(cell.row.original._id)}
            >
              <Icon as={PiEyeDuotone} />
            </Button>
          </>
        ),
      },
    ],
    []
  );
  // data state to store the TV Maze API data. Its initial value is an empty array
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
      <Box w={"100%"}>
        <form
          className="flex"
          id="group-form"
          onSubmit={(e) => handleSubmitInfo(e)}
        >
          <FormControl id="name" isRequired>
            <FormLabel w="100%" mb={1} fontSize={15} color={"#331E38"}>
              Group Name:
            </FormLabel>
            <Input
              isReadOnly={state}
              type=""
              value={title}
              maxLength={64}
              variant="login"
              borderWidth={"2px"}
              borderColor={"#70A0AF"}
              bg="#F7FAFC"
              mb={3}
              size={"md"}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <FormControl mb={"10"} id="supervisor" isRequired>
            <FormLabel mb={1} fontSize={15} color={"#331E38"}>
              Supervisor:
            </FormLabel>
            <Input
              isReadOnly={state}
              type=""
              value={title}
              maxLength={64}
              variant="login"
              borderWidth={"2px"}
              borderColor={"#70A0AF"}
              bg="#F7FAFC"
              mb={3}
              size={"md"}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <Text fontWeight={"semibold"}>Group Members:</Text>
          <GroupUsers columns={columns} data={data} />
        </form>
      </Box>
    </>
  );
}
