"use client";
import { useState } from "react";
import UpdateProfile from "./UpdateProfile";
import UpdatePassword from "./UpdatePassword";
import GroupMembership from "./GroupMembership";
import { signOut } from "next-auth/react";
import { Button, ButtonGroup, Center, VStack } from "@chakra-ui/react";

export default function Page() {
  const [mode, setMode] = useState("View");

  const handleLogout = (e) => {
    e.preventDefault();
    signOut({ callbackUrl: "/Auth/Logout" });
  };

  return (
    <>
      <Center my="2em">
        <VStack>
          <ButtonGroup>
            <Button
              bgColor={"#70A0AF"}
              color={"white"}
              _hover={{ bgColor: "#706993", color: "white" }}
              onClick={() => setMode("View")}
            >
              Profile
            </Button>
            <Button
              bgColor={"#70A0AF"}
              color={"white"}
              _hover={{ bgColor: "#706993", color: "white" }}
              onClick={() => setMode("UpdatePassword")}
            >
              Password
            </Button>
            <Button
              bgColor={"#70A0AF"}
              color={"white"}
              _hover={{ bgColor: "#706993", color: "white" }}
              onClick={() => setMode("Group")}
            >
              Group
            </Button>
            <Button
              bgColor={"#70A0AF"}
              color={"white"}
              _hover={{ bgColor: "#706993", color: "white" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </ButtonGroup>
          {mode === "View" && (
            <>
              <UpdateProfile />
            </>
          )}
          {mode === "UpdatePassword" && (
            <>
              <UpdatePassword />
            </>
          )}
          {mode === "Group" && (
            <>
              <GroupMembership />
            </>
          )}
        </VStack>
      </Center>
    </>
  );
}
