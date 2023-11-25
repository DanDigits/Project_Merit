import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "utils/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "server/mongodb/actions/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Placeholder",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = login(credentials);
        console.log(user);

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.rank = user.rank;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.suffix = user.suffix;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.rank = token.rank;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.suffix = token.suffix;
      session.user.role = token.role;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth({
  ...authOptions,
  adapter: MongoDBAdapter(clientPromise),
  debug: true,
  session: {
    jwt: true,
    strategy: "jwt",
  },
  pages: {
    signIn: "/Auth/Login",
    signOut: "/Auth/Logout",
  },
});

export { handler as GET, handler as POST };
