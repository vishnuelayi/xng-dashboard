import React from "react";
import { API_USERS } from "../../../../../../api/api";
import { UserManagementCardsResponse } from "../../../../../../profile-sdk";

const useUserManagementCardsApi = (loggedInClientId: string | undefined, state: string) => {
  const [data, setData] = React.useState<UserManagementCardsResponse | undefined>(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [loading, setIsLoading] = React.useState<boolean>(false);
  const [refetch, setRefetch] = React.useState<boolean>(false);

  const refetchData = React.useCallback(() => {
    setRefetch((prev) => !prev);
  }, []);

  React.useEffect(() => {
    const getUserCards = async () => {
      setIsLoading(true);
      try {
        const usersManagementData = await API_USERS.v1UsersUserManagementCardsGet(
          loggedInClientId || "",
          state,
        );
        setData(usersManagementData);
        // console.log(userCards);
      } catch (error) {
        console.log(error);
        setError("Problem fetching user Management Data");
      }
      setIsLoading(false);
    };

    getUserCards();
  }, [loggedInClientId, state, refetch]);

  return { data, error, loading, refetchData };
};

export default useUserManagementCardsApi;
