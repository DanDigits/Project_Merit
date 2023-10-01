"use client";

import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import {
  Center,
  Card,
  Button,
  ButtonGroup,
  CardBody,
  CardHeader,
  CardFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { getUser, updateUser } from "src/app/actions/User";

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
  const { data: session, update } = useSession();

  var state;

  if (mode === "View") {
    state = true;
  } else state = false;

  useEffect(() => {
    if (!hasEmail) {
      //console.log("!hasemail");
      setIsLoading(true);
      setHasError(false);
      getSession()
        .then((session) => setEmail(session.user.email))
        .then(() => setHasEmail(true));
    }
    if (hasEmail && !hasProfile) {
      console.log("hasEmail && !hasProfile", email, hasProfile);
      setIsLoading(true);
      console.log("isLoading: ", isLoading);
      setHasError(false);
      getUser({ email }).then((response) => {
        response.ok
          ? response
              .json()
              .then((response) => setProfile(response))
              .then(setHasProfile(true))
          : setHasError(true);
        console.log("hasError:", hasError);
      });
    }
    if (hasEmail && hasProfile) {
      console.log("hasEmail && hasProfile", hasEmail, hasProfile);
      console.log("Profile: ", profile);
      var arr = JSON.parse(JSON.stringify(profile));
      if (arr) {
        console.log(arr.rank);
        console.log(arr.firstName);
        console.log(arr.lastName);
        console.log(arr.suffix);

        setRank(arr.rank);
        setFirstName(arr.firstName);
        setLastName(arr.lastName);
        setSuffix(arr.suffix);
        setIsLoading(false);
      } else {
        console.log("Arr is empty");
      }
    }
  }, [hasEmail, hasProfile, email, profile, hasError, isLoading]);

  const handleSubmitInfo = (e) => {
    e.preventDefault();

    updateUser({ email, rank, firstName, lastName, suffix }).then(
      (response) => {
        if (response.ok) {
          {
            setMode("View");
            updateSession({ rank, lastName, suffix });
          }
        } else {
          alert("User could not be updated. Please try again.");
        }
      }
    );
  };

  const updateSession = async ({ rank, lastName, suffix }) => {
    await update({
      ...session,
      user: {
        ...session?.user,
        rank: rank,
        lastName: lastName,
        suffix: suffix,
      },
    });
  };

  return (
    <>
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
            p={2}
            alignSelf={"center"}
            size={{ base: "sm", md: "md" }}
            w={{ md: "lg" }}
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
              </div>
            </CardBody>
            <CardFooter>
              <ButtonGroup>
                {mode === "View" && (
                  <>
                    <Button
                      bgColor={"#70A0AF"}
                      color={"white"}
                      _hover={{ bgColor: "#706993", color: "white" }}
                      onClick={() => setMode("Edit")}
                    >
                      Edit
                    </Button>
                  </>
                )}
                {mode === "Edit" && (
                  <>
                    <Button
                      bgColor={"#A0C1B9"}
                      color={"#331E38"}
                      _hover={{ bgColor: "#706993", color: "white" }}
                      onClick={() => setMode("View")}
                    >
                      Cancel
                    </Button>
                    <Button
                      bgColor={"#70A0AF"}
                      color={"white"}
                      _hover={{ bgColor: "#706993", color: "white" }}
                      form="profile-form"
                      type="submit"
                      onClick={(e) => handleSubmitInfo(e)}
                    >
                      Update
                    </Button>
                  </>
                )}
              </ButtonGroup>
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
