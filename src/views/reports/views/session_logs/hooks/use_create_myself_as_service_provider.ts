import { useCallback } from "react";
import { selectUser } from "../../../../../context/slices/userProfileSlice";
import { useXNGSelector } from "../../../../../context/store";
import { ServiceProviderRef } from "../../../../../profile-sdk";

export function useCreateMyselfAsServiceProvider(): () => ServiceProviderRef {
  const user = useXNGSelector(selectUser);

  const createMyselfAsServiceProvider = useCallback((): ServiceProviderRef => {
    const res: ServiceProviderRef = {
      id: user!.id!,
      email: user!.emailAddress!,
      firstName: user!.firstName!,
      lastName: user!.lastName!,
    };

    return res;
  }, [user]);

  return createMyselfAsServiceProvider;
}
