"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import {
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
} from "@chakra-ui/react";

import { getUser } from "src/app/actions/User";

export default function UpdateProfile() {
  const [rank, setRank] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [profile, setProfile] = useState(null);
  const [hasEmail, setHasEmail] = useState("");
  const [hasProfile, setHasProfile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

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
      console.log("hasEmail && hasProfile", email, hasProfile);
      setIsLoading(false);
      console.log(profile);
      console.log("isLoading", isLoading);
    }
  }, [hasEmail, hasProfile, email]);

  const handleSubmitInfo = (e) => {
    e.preventDefault();
  };

  return (
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
            <FormControl id="rank">
              <FormLabel mb={1} fontSize={15} color={"black"}>
                Rank
              </FormLabel>
              <Select
                placeholder="Select Rank"
                value={rank}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#ECECEC"
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
                <option value={"SMSgt"}>Senior Master Sergeant (SMSgt)</option>
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
                <option value={"Brig Gen"}>Brigadier General (Brig Gen)</option>
                <option value={"Maj Gen"}>Major General (Maj Gen)</option>
                <option value={"Lt Gen"}>Lieutenant General (Lt Gen)</option>
                <option value={"Gen"}>
                  General Air Force Chief of Staff (Gen)
                </option>
                <option value={"GOAF"}>General of the Air Force (GOAF)</option>
              </Select>
            </FormControl>
            <FormControl id="firstName">
              <FormLabel mb={1} fontSize={15} color={"black"}>
                First Name
              </FormLabel>
              <Input
                type=""
                value={firstName}
                maxLength={64}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#ECECEC"
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
                type=""
                value={lastName}
                maxLength={64}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#ECECEC"
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
                type=""
                value={suffix}
                maxLength={6}
                variant="login"
                borderWidth={"2px"}
                borderColor={"#70A0AF"}
                bg="#ECECEC"
                mb={3}
                size={"md"}
                onChange={(e) => setSuffix(e.target.value)}
              />
            </FormControl>
          </div>
        </CardBody>
        <CardFooter>
          <ButtonGroup>
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
          </ButtonGroup>
        </CardFooter>
      </Card>
    </>
  );
}
