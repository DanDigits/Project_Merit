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
  useDisclosure,
  Table,
  Tbody,
  Thead,
  Th,
  Tr,
  Td,
  HStack,
  ButtonGroup,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PiEyeDuotone } from "react-icons/pi";
import { useRouter } from "next/navigation";
import Dialog from "../NewGroup/dialog";
import { removeFromGroup, getGroup } from "src/app/actions/Group";
import { getUser, updateUser } from "src/app/actions/User";

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
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [status, setStatus] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [dialogStatus, setDialogStatus] = useState(false);
  const [supervisor, setSupervisor] = useState("");
  const [supEmail, setSupEmail] = useState("");
  const [total, setTotal] = useState(0);
  const [data, setData] = useState("");

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

  const handleChange = (e) => {
    setSearchEmail(e);
    setStatus("");
  };

  const handleSearch = (email) => {
    setSearchLoading(true);
    if (email != "") {
      console.log("searching email:", email);
      getUser({ email }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => JSON.parse(JSON.stringify(response)).group)
              .then((response) => {
                response === ""
                  ? updateUser({ email, group: groupName }).then((response) => {
                      if (response.ok) {
                        setStatus("success");
                        setRefresh(refresh + 1);
                        setEntry(null);
                        setHasEntry(false);
                      } else setStatus("error");
                      console.log("update user:", email);
                    })
                  : setStatus("assigned");
              })
          : setStatus("invalid");
        console.log("got user:", email);
      });
    }
    setSearchLoading(false);
  };

  const handleRemove = (userArray) => {
    if (userArray && userArray.length != 0) {
      setRemoveLoading(true);
      removeFromGroup({ userArray }).then((response) => {
        if (response.ok) {
          {
            setRefresh(refresh + 1);
            setEntry(null);
            setHasEntry(false);
          }
        } else {
          alert("Remove failed");
        }
      });
      setRemoveLoading(false);
    }
  };

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
    console.log("refresh", refresh);
    if (group_mode === "View" || refresh > 0) {
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
        if (groupName === "null") {
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
          console.log("arr", arr);
          setSupEmail(arr[0][0].email);
          setSupervisor(
            [arr[0][0].firstName, arr[0][0].lastName, arr[0][0].suffix]
              .filter(Boolean)
              .join(" ")
          );
          setTotal(arr[1].length);
          setData(arr[1]);
          setIsLoading(false);
        }
      }
    }
  }, [hasEntry, hasGroupName, groupName, entry, group_mode, router, refresh]);

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
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      globalFilter: globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: true, //enable row selection for all rows
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

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
              value={groupName == "null" ? "" : groupName}
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
          <FormControl id="supEmail" isRequired>
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
                <Box mx={{ base: -4, md: 0 }}>
                  <HStack my={2} justify={"space-between"}>
                    <Input
                      size={{ base: "sm", md: "md" }}
                      w={{ base: "50%", md: "xs" }}
                      variant="login"
                      borderWidth={"1px"}
                      borderColor={"#70A0AF"}
                      bg="#ECECEC"
                      value={globalFilter}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                      placeholder="Search group"
                    />

                    <ButtonGroup
                      display={group_mode === "View" ? "none" : "initial"}
                    >
                      <Button
                        size={{ base: "sm", md: "md" }}
                        bgColor={"#DF2935"}
                        color={"white"}
                        _hover={{ bgColor: "#031926", color: "white" }}
                        isLoading={removeLoading}
                        onClick={onOpen}
                      >
                        Remove
                      </Button>
                      <AlertDialog isOpen={isOpen} onClose={onClose}>
                        <AlertDialogOverlay>
                          <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                              Remove Users
                            </AlertDialogHeader>
                            <AlertDialogBody>Are you sure?</AlertDialogBody>
                            <AlertDialogFooter>
                              <Button onClick={onClose}>Cancel</Button>
                              <Button
                                colorScheme="red"
                                onClick={() => {
                                  onClose();
                                  handleRemove(
                                    table
                                      .getSelectedRowModel()
                                      .flatRows.map(
                                        ({ original }) => original.email
                                      )
                                  );
                                }}
                                ml={3}
                              >
                                Remove
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialogOverlay>
                      </AlertDialog>

                      <Button
                        size={{ base: "sm", md: "md" }}
                        bgColor={"#7eb67d"}
                        color={"black"}
                        _hover={{ bgColor: "#031926", color: "white" }}
                        onClick={() => setOpenSearch(!openSearch)}
                      >
                        Add Member
                      </Button>
                    </ButtonGroup>
                  </HStack>
                  <Box
                    p={2}
                    display={
                      openSearch && group_mode === "Edit" ? "initial" : "none"
                    }
                  >
                    <Text>Enter member email:</Text>
                    <HStack justify={"flex-start"}>
                      <Input
                        value={searchEmail}
                        size={{ base: "sm", md: "md" }}
                        w={{ base: "50%", md: "xs" }}
                        variant="login"
                        borderWidth={"1px"}
                        borderColor={"#70A0AF"}
                        bg="#ECECEC"
                        onChange={(e) => handleChange(e.target.value)}
                      />
                      <Button
                        size={{ base: "sm", md: "md" }}
                        bgColor={"#6abbc4"}
                        color={"black"}
                        _hover={{ bgColor: "#031926", color: "white" }}
                        isLoading={searchLoading}
                        onClick={() => handleSearch(searchEmail)}
                      >
                        Search
                      </Button>
                    </HStack>
                    {status === "error" && (
                      <p>There was an error when searching for member.</p>
                    )}
                    {status === "invalid" && (
                      <p>The member you entered does not exist.</p>
                    )}
                    {status === "assigned" && (
                      <p>The member you entered is already in a group.</p>
                    )}
                    {status === "success" && <p>Member successfully added.</p>}
                  </Box>

                  <Box overflowX={"auto"}>
                    <Table variant={"mytable"} color={"black"}>
                      <Thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <Th key={header.id}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </Th>
                            ))}
                          </Tr>
                        ))}
                      </Thead>
                      <Tbody>
                        {table.getRowModel().rows.map((row) => (
                          <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                              <Td key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </Td>
                            ))}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                  <div>
                    {Object.keys(rowSelection).length} of{" "}
                    {table.getPreFilteredRowModel().rows.length} Total Rows
                    Selected
                  </div>
                </Box>
              </>
            )}
          </>
        </form>
      </Box>
      {Dialog(dialogStatus)}
    </>
  );
}
