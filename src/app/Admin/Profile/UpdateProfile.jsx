"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import {
  Center,
  Card,
  Button,
  CardBody,
  CardHeader,
  CardFooter,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Spacer,
  Spinner,
} from "@chakra-ui/react";
import { getUser, updateUser } from "src/app/actions/User";
import DeleteDialog from "./DeleteDialog.jsx";

export default function UpdateProfile() {
  const [mode, setMode] = useState("View");
  const [rank, setRank] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [profile, setProfile] = useState(null);
  const [hasEmail, setHasEmail] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [msg, setMsg] = useState("");

  var state;

  if (mode === "View") {
    state = true;
  } else state = false;

  useEffect(() => {
    if (!hasEmail && !isLoading) {
      console.log("Fetching email");
      setIsLoading(true);
      setHasError(false);
      getSession()
        .then((session) => setEmail(session.user.email))
        .then(() => setHasEmail(true))
        .then(setIsLoading(false));
    }

    if (hasEmail && !hasProfile && !isLoading) {
      setIsLoading(true);
      setHasError(false);
      getUser({ email }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setProfile(response))
              .then(setHasProfile(true))
              .then(setIsLoading(false))
          : setHasError(true);
        console.log("hasError:", hasError);
      });
    }

    if (hasEmail && hasProfile) {
      var arr = JSON.parse(JSON.stringify(profile));
      if (arr) {
        setRank(arr.rank);
        setFirstName(arr.firstName);
        setLastName(arr.lastName);
        setSuffix(arr.suffix);
        setIsLoading(false);
      }
    }
  }, [hasEmail, hasProfile, email, profile, hasError, isLoading]);

  const handleSubmitInfo = (e) => {
    e.preventDefault();

    if (rank === "" || firstName === "" || lastName === "") {
      setMsg("missing");
    } else {
      updateUser({ email, rank, firstName, lastName }).then((response) => {
        if (response.ok) {
          {
            setMode("View");
            setMsg("");
          }
        } else {
          alert("User could not be updated. Please try again.");
        }
      });
    }
  };

  return (
    <>
      {DeleteDialog(deleteStatus, email)}
      {isLoading ? (
        <>
          <Center>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="#70A0Af"
              size="xl"
            />
          </Center>
        </>
      ) : (
        <>
          <Card
            p={{ base: 0, md: 2 }}
            alignSelf={"center"}
            size={{ base: "sm", md: "lg" }}
            w={{ base: "100%", lg: "lg" }}
            bgColor={"white"}
          >
            <CardHeader mb={-5} fontSize={30} color={"black"}>
              Update Profile
            </CardHeader>
            <CardBody>
              <div>
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
                      <option value={"1st Lt"}>
                        First Lieutenant (1st Lt)
                      </option>
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

                <FormControl id="firstName">
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
                    bg="#EDF2F7"
                    mb={3}
                    size={"md"}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </FormControl>
                <FormControl id="lastName">
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
                    bg="#EDF2F7"
                    mb={3}
                    size={"md"}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </FormControl>
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
                    bg="#EDF2F7"
                    mb={3}
                    size={"md"}
                    onChange={(e) => setSuffix(e.target.value)}
                  />
                </FormControl>
                {msg === "missing" && (
                  <p>All fields except suffix are required.</p>
                )}
              </div>
            </CardBody>
            <CardFooter>
              {mode === "View" && (
                <Flex width={"100%"}>
                  <Button
                    size={{ base: "sm", md: "md" }}
                    bgColor={"#6abbc4"}
                    color={"white"}
                    _hover={{ bgColor: "#031926", color: "white" }}
                    onClick={() => setMode("Edit")}
                  >
                    Edit Profile
                  </Button>
                  <Spacer />
                  <Button
                    size={{ base: "sm", md: "md" }}
                    bgColor={"#DF2935"}
                    color={"white"}
                    _hover={{ bgColor: "#031926", color: "white" }}
                    onClick={() => setDeleteStatus(true)}
                  >
                    Delete Account
                  </Button>
                </Flex>
              )}
              {mode === "Edit" && (
                <Flex>
                  <HStack justify={"flex-end"}>
                    <Button
                      bgColor={"#A0C1B9"}
                      color={"#331E38"}
                      _hover={{ bgColor: "#031926", color: "white" }}
                      onClick={() => setMode("View")}
                    >
                      Cancel
                    </Button>
                    <Spacer />
                    <Button
                      bgColor={"#70A0AF"}
                      color={"white"}
                      _hover={{ bgColor: "#031926", color: "white" }}
                      form="profile-form"
                      type="submit"
                      onClick={(e) => handleSubmitInfo(e)}
                    >
                      Update
                    </Button>
                  </HStack>
                </Flex>
              )}
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
