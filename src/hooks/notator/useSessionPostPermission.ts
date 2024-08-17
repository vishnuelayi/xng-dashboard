import { useXNGDispatch, useXNGSelector } from "../../context/store";
import { selectDataEntryProvider } from "../../context/slices/dataEntryProvider";
import { selectLoggedInClientAssignment } from "../../context/slices/userProfileSlice";
import { useEffect, useState } from "react";
import { SimpleAttentionMessagesActions } from "../../context/slices/SimpleAttentionMessageSlice";

/* 
  HOOK USE CASE:
  Strictly for providers who are data entry clerks and have been denied access to post.
  If providers aren't data entry clerks, then they're immediately granted access. This could
  be useful for potentially including other session posting validation.
*/
export const useSessionPostPermission = () => {
  const userClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const dataEntryProvider = useXNGSelector(selectDataEntryProvider);
  const dispatch = useXNGDispatch();
  const [canPost, setCanPost] = useState(false);

  const showAccessDeniedModal = () => {
    dispatch(
      SimpleAttentionMessagesActions.ACTION_ShowModal({
        show: true,
        message: `${dataEntryProvider?.firstName} ${dataEntryProvider?.lastName} has not given you
      access to post on their behalf. Please
      have them log in and grant access via
      their notification center, then try again.`,
      }),
    );
  };

  useEffect(() => {
    if (dataEntryProvider) {
      const assignment = userClientAssignment.appointingServiceProviders?.find(
        (p) => p.id === dataEntryProvider.id,
      );
      const canPost = assignment?.hasGrantedAccessToPost;
      if (canPost) {
        // console.log("Can POST")
        setCanPost(true);
      } else {
        // console.log("CANNOT POST");
        setCanPost(false);
      }
    } else {
      setCanPost(true);
    }
  }, [userClientAssignment, dataEntryProvider]);

  return { canPost, showAccessDeniedModal };
};
