import { selectActingServiceProvider } from "../../../context/slices/dataEntryProvider";
import { useXNGSelector } from "../../../context/store";
import { SessionDayViewCard } from "../../../session-sdk";

export function useGetSessionsForUserAsApprover() {
  const actingServiceProvider = useXNGSelector(selectActingServiceProvider);

  function sessionIsScheduledOrInProgress(s: SessionDayViewCard) {
    return s.status === 0 || s.status === 1;
  }

  function getSessionsForUserAsApprover(sessions: SessionDayViewCard[]) {
    const [ownSessions, assistantSessions] = sessions!.reduce<
      [SessionDayViewCard[], SessionDayViewCard[]]
    >(
      (acc, session) => {
        if (session.serviceProvider?.id! === actingServiceProvider?.id!) {
          // Accumulate array: `ownSessions`
          acc[0].push(session);
        } else {
          // Accumulate array: `assistantSessions`
          // The only thing we need to make sure of is that scheduled and in progress sessions do not display.

          if (!sessionIsScheduledOrInProgress(session)) {
            acc[1].push(session);
          }
        }
        return acc;
      },
      [[], []],
    );

    return [...ownSessions, ...assistantSessions];
  }

  return getSessionsForUserAsApprover;
}
