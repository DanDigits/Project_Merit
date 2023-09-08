/* eslint-disable prettier/prettier */
//function getBaseURL() {
// Base URL for respective installations (container/local/etc)
// console.log(process.env.NEXTAUTH_URL);
// if (process.env.NEXTAUTH_URL != "localhost") {
//   return `http://${process.env.NEXTAUTH_URL}:80`;
// } else {
//   return `http://localhost:3000`;
// }
//}

export default {
  baseUrl: "http://localhost:3000",
  api: {
    reports: {
      create: "/api/Reports/create",
      get: "/api/Reports/get",
      update: "/api/Reports/update",
      delete: "/api/Reports/delete",
    },
    user: {
      signUp: "/api/user/signUp",
    },
  },
};
