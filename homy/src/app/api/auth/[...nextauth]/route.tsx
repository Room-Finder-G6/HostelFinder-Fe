import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Configure NextAuth options
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    // Add more providers here
  ],
  // You can add more options here like callbacks, pages, etc.
};

const handler = NextAuth(authOptions);

// Define handlers for HTTP methods
export { handler as GET, handler as POST };
