/* eslint-disable prettier/prettier */
function getBaseURL() {
  // Check if a domain name has been assigned, and correct application URLs accordingly
  if (!process.env.NEXT_PUBLIC_NEXTAUTH_URL) {
    return `http://localhost:3000`;
  } else if (process.env.NEXT_PUBLIC_NEXTAUTH_URL != "localhost") {
    if (
      process.env.NEXT_PUBLIC_NEXTAUTH_URL.toLowerCase().includes("http://")
    ) {
      return `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}:80`;
    } else {
      return `http://${process.env.NEXT_PUBLIC_NEXTAUTH_URL}:80`;
    }
  }
}

export default {
  baseUrl: getBaseURL(),
  api: {
    reports: {
      create: "/api/reports/create",
      get: "/api/reports/get",
      update: "/api/reports/update",
      delete: "/api/reports/delete",
    },
    user: {
      signUp: "/api/user/signUp",
    },
  },
};
