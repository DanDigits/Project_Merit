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
    } else if (
      process.env.NEXT_PUBLIC_NEXTAUTH_URL.toLowerCase().includes("https://")
    ) {
      return `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}:443`;
    } else {
      return `https://${process.env.NEXT_PUBLIC_NEXTAUTH_URL}:443`;
    }
  }
}

export default {
  baseUrl: getBaseURL(),
  api: {
    reports: {
      create: "/api/reports/",
      get: "/api/reports/",
      update: "/api/reports/",
      delete: "/api/reports/",
    },
    user: {
      signUp: "/api/user/",
    },
  },
};
