//function getBaseURL() {
//   // URLs if application is hosted on Vercel, prior code; is incomplete/ineffective
//   if (process.env.VERCEL_URL) {
//     return `http://${process.env.NEXTAUTH_URL}`;
//   } else {
//     return "http://localhost:3000";
//   }
// }

export default {
  baseUrl: process.env.NEXTAUTH_URL, //getBaseURL(),
  api: {
    reports: {
      create: "/api/Reports/create",
      get: "/api/Reports/get",
      update: "/api/Reports/update",
      delete: "/api/Reports/delete",
    },
    user: {
      signUp: "/auth/signUp",
    },
  },
};
