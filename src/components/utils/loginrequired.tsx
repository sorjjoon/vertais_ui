import { useRouter } from "next/router";
import React from "react";
import { useCurrentUser } from "../providers/userprovider";

export const LoginRequired: React.FC = ({ children }) => {
  const user = useCurrentUser();
  const router = useRouter();
  if (user === null) {
    console.log("Not logged in, redirecting");
    router.replace({ pathname: "/login", query: { next: window.location.href } });
  }
  return <>{children}</>;
};

export default LoginRequired;
