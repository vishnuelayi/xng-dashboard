import React from 'react'
import { API_SESSIONS } from '../../../../api/api';
import { GetUnpostedSessionCountResponse } from '../../../../session-sdk';
import { useXNGDispatch } from '../../../../context/store';
import { unpostedSessionsActions } from '../../../../context/slices/unpostedSessionsSlice';

const useUnpostedSessionsCountApi = (state: string, loggedInUserId: string | undefined, loggedInClientId: string | undefined, refetch:boolean) => {

  const [data, setData] = React.useState<GetUnpostedSessionCountResponse | undefined>(undefined);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const dispatch = useXNGDispatch();

  React.useEffect(() => {
    const getUnpostedSessionsCount = async () => {
      setIsLoading(true);
      try {
        const unpostedSessionsCount = await API_SESSIONS.v1SessionsUnpostedCountGet(state, loggedInUserId, loggedInClientId);
        setData(unpostedSessionsCount);
        dispatch(unpostedSessionsActions.setUnpostedSessionsCount(unpostedSessionsCount));
      }
      catch (error) {
        // console.error(error);
        setError("Unable to fetch unposted sessions count");
      }
      finally {
        setIsLoading(false);
      }
    }
    getUnpostedSessionsCount();
  }, [dispatch, loggedInClientId, loggedInUserId, state, refetch]);
  return {
    data,
    error,
    isLoading
  }
}

export default useUnpostedSessionsCountApi