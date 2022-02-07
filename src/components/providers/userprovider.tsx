import React from "react";
import { useCurrentUserQuery, UserFragment } from "../../generated/graphql";

const CurrentUserContext = React.createContext<UserFragment | null | undefined>(undefined);

export const UserProvider: React.FC = ({ children }) => {
  const [{ data, fetching }] = useCurrentUserQuery();
  if (fetching) {
    return <CurrentUserContext.Provider value={undefined}>{children}</CurrentUserContext.Provider>;
  } else {
    return <CurrentUserContext.Provider value={data?.currentUser ?? null}>{children}</CurrentUserContext.Provider>;
  }
};

export const useCurrentUser = () => React.useContext(CurrentUserContext);
