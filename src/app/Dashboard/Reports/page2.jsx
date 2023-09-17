/*
"use client";
import React, { useEffect, useState } from "react";
import { getUserReports } from "src/app/actions/Report";
import { getSession } from "next-auth/react";
import Reports from "./Reports.jsx";

export async function getServerSideProps() {
  const [email, setEmail] = useState("");
  const [reports, setReports] = useState("");

  useEffect(() => {
    getSession().then((session) => setEmail(session.user.email));
  }, []);

  const loadReports = () => {
    getUserReports(email).then((response) => {
      if (response.ok) {
        {
          setReports(JSON.parse(JSON.stringify(response)));
        }
      } else {
        alert("Error loading report list.");
      }
    });
  };

  //const reports = await getUserReports(email);

  return {
    props: {
      reports: JSON.parse(JSON.stringify(reports)),
    },
  };
}

const ReportsWrapper = (props) => <Reports {...props} />;

export default ReportsWrapper;
*/
