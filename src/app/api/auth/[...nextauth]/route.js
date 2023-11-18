import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "utils/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "server/mongodb/actions/User";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 40000,
      },
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Placeholder",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const user = login(credentials);
        console.log(user);

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session }) {
      console.log("jwt callback", { token, user, session });

      // pass in id, email, rank, lastName, and suffix to token
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
    async session({ session, token, user }) {
      console.log("session callback", { token, user, session });
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
