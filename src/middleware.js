export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/Index",
    "/Guidelines",
    "/Profile",
    "/Reports",
    "/NewReport",
    "/ViewReport",
  ],
};
