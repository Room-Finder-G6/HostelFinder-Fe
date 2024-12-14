import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
// Configure NextAuth options
const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  
};

const handler = NextAuth(authOptions)


export { handler as GET, handler as POST };
