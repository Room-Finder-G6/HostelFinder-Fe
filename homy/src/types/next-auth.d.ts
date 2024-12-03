import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      idToken: string; 
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface JWT extends DefaultJWT {
    id: string; 
    accessToken: string;
  }
}
