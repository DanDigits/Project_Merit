"use client";
import { useState } from "react";
import UpdateProfile from "./UpdateProfile";
import UpdatePassword from "./UpdatePassword";
import GroupMembership from "./GroupMembership";
import { signOut } from "next-auth/react";
import { Button, ButtonGroup, VStack } from "@chakra-ui/react";

export default function Page() {
  const [mode, setMode] = useState("View");

  const handleLogout = (e) => {
    e.preventDefault();
    signOut({ callbackUrl: "/Auth/Logout" });
  };

  return (
    <>
      <VStack mx={"-4"} my={"5vh"}>
        <ButtonGroup>
          <Button
            size={{ base: "sm", md: "md" }}
            bgColor={"#6abbc4"}
            color={"white"}
            _hover={{ bgColor: "#031926", color: "white" }}
            onClick={() => setMode("View")}
          >
            Profile
          </Button>
          <Button
            size={{ base: "sm", md: "md" }}
            bgColor={"#6abbc4"}
            color={"white"}
            _hover={{ bgColor: "#031926", color: "white" }}
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
            size={{ base: "sm", md: "md" }}
            bgColor={"#6abbc4"}
            color={"white"}
            _hover={{ bgColor: "#031926", color: "white" }}
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
    </>
  );
}
