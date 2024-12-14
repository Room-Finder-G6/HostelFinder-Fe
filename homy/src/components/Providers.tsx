'use client';

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import type { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    // <SessionProvider>
      <Provider store={store}>
        {children}
      </Provider>
    // </SessionProvider>
  );
};

export default Providers;
