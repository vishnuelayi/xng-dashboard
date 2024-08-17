import { useMemo, useState, useEffect, useCallback, createContext, useContext, FC } from "react";
import { useXNGSelector } from "../../../../context/store";
import { selectLoggedInClientAssignment } from "../../../../context/slices/userProfileSlice";
import dayjs, { type Dayjs } from "dayjs";
import type { DistrictRef, ServiceProviderRef } from "../../../../profile-sdk";
import { API_SESSIONS } from "../../../../api/api";
import { ActualSession, Student } from "../../../../session-sdk";
import { selectStateInUS } from "../../../../context/slices/stateInUsSlice";
import useUserRole from "../../../../hooks/useUserRole";
import removeArrayDuplicates from "../../../../utils/remove_array_duplicates";

interface IUnpostedSessionsBatchPostContext {
  //stateInUS
  stateInUs: string;

  // sessions
  sessions: ActualSession[];
  selectedSessionIds: string[];
  selectedSessionIndexes: number[];

  onSelectSession: (selectedId: string, checked: boolean, index: number) => void;
  onSelectAllSessions: (checked: boolean) => void;

  // filters
  startDate: Dayjs;
  endDate: Dayjs;

  providers: ServiceProviderRef[];
  selectedProviderIds: string[];

  campuses: DistrictRef[];
  selectedCampusIds: string[];

  students: Student[];
  selectedStudentIds: string[];

  onChangeDateRange: (dateRange: { start: Dayjs; end: Dayjs }) => void;
  onChangeSelectedProviderIds: (selectedProviderIds: string[]) => void;
  onChangeSelectedCampusIds: (selectedCampusIds: string[]) => void;
  onChangeSelectedStudentIds: (selectedStudentIds: string[]) => void;

  refresh: () => void;
  isLoading: boolean;
  isPosting: boolean
  setIsPosting: React.Dispatch<React.SetStateAction<boolean>>
}

const UnpostedSessionsBatchPostContext = createContext<IUnpostedSessionsBatchPostContext>(null!);

const UnpostedSessionsBatchPostProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    serviceProviderProfile,
    appointingServiceProviders,
    supervisedServiceProviders,
    authorizedDistricts,
    isAutonomous,
    isProxyDataEntry,
  } = useXNGSelector(selectLoggedInClientAssignment);

  const { isAssistant } = useUserRole();

  const stateInUs = useXNGSelector(selectStateInUS);

  const providers = useMemo(
    () => {
      const allProviders =  removeArrayDuplicates([
        ...(serviceProviderProfile ? [serviceProviderProfile] : []),
        ...(appointingServiceProviders ?? []),
        ...(supervisedServiceProviders ?? []),
      ], (() => "id"))

      return allProviders;
    },
    [serviceProviderProfile, appointingServiceProviders, supervisedServiceProviders],
  );

  const [sessions, setSessions] = useState<ActualSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ActualSession[]>([]);
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [selectedSessionIndexes, setSelectedSessionIndexes] = useState<number[]>([]);

  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(2, "w"));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const [selectedProviderIds, setSelectedProviderIds] = useState<string[]>(
    providers.map(({ id }) => id!),
  );
  const [selectedCampusIds, setSelectedCampusIds] = useState<string[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const campuses = useMemo(() => authorizedDistricts ?? [], [authorizedDistricts]);

  const handleSelectSession = useCallback<IUnpostedSessionsBatchPostContext["onSelectSession"]>(
    (selectedId, checked, selectedIndex) => {
      if (!checked) {
        setSelectedSessionIds(selectedSessionIds.filter((id) => id !== selectedId));
        setSelectedSessionIndexes(
          selectedSessionIndexes.filter((index) => index !== selectedIndex),
        );
      } else if (!selectedSessionIds.includes(selectedId)) {
        setSelectedSessionIds([...selectedSessionIds, selectedId]);
        setSelectedSessionIndexes([...selectedSessionIndexes, selectedIndex]);
      }
    },
    [selectedSessionIds],
  );

  const handleSelectAllSessions = useCallback<
    IUnpostedSessionsBatchPostContext["onSelectAllSessions"]
  >(
    (checked) => {
      setSelectedSessionIds(checked ? filteredSessions.map(({ id }) => id!) : []);
      setSelectedSessionIndexes(checked ? filteredSessions.map((session, index) => index!) : []);
    },
    [sessions, filteredSessions],
  );

  const handleChangeDateRange = useCallback<IUnpostedSessionsBatchPostContext["onChangeDateRange"]>(
    ({ start, end }) => {
      setStartDate(start);
      setEndDate(end);
    },
    [],
  );

  const handleChangeSelectedProviderIds = useCallback<
    IUnpostedSessionsBatchPostContext["onChangeSelectedProviderIds"]
  >((selectedProviderIds) => setSelectedProviderIds(selectedProviderIds), []);

  const handleChangeSelectedCampusIds = useCallback<
    IUnpostedSessionsBatchPostContext["onChangeSelectedCampusIds"]
  >((selectedCampusIds) => setSelectedCampusIds(selectedCampusIds), []);

  const handleChangeSelectedStudentIds = useCallback<
    IUnpostedSessionsBatchPostContext["onChangeSelectedStudentIds"]
  >((selectedStudentIds) => setSelectedStudentIds(selectedStudentIds), []);

  const refresh = () => {
    setSelectedProviderIds(providers.map(({ id }) => id!));
    setSelectedSessionIds([]);
  };

  const getPostableSessionsByDateRangeAndProviderRangeGet = () => {
    setIsLoading(true);
    /**
     * assistantServiceProviderIds in v1SessionsPostableSessionsByDateRangeAndProviderRangeGet api call will
     * sometimes have the same id as the currentUserServiceProviderId inside of it, causing sessions to be retrieved
     * that shouldn't be, so we filter assistantServiceProviderIds here. Passing undefined  if the resulting filtered array is empty
     * removes assistantServiceProviderIds from the query string parameters in the network request entirely and is still an acceptable api call
     */
    function filterSelectedProviderIdList() {
      let filteredSelectedProviderIdList = undefined;

      if (selectedProviderIds.includes(serviceProviderProfile!.id!)) {
        if (selectedProviderIds.length === 1) {
          filteredSelectedProviderIdList = selectedProviderIds.join(",");
        } else {
          filteredSelectedProviderIdList = selectedProviderIds
            .filter((id) => id !== serviceProviderProfile!.id!)
            .join(",");
        }
      } else {
        filteredSelectedProviderIdList = selectedProviderIds.join(",");
      }
      return filteredSelectedProviderIdList;
    }

    const UTCOffset = startDate.toDate().getTimezoneOffset() / 60
    
    API_SESSIONS.v1SessionsPostableSessionsByDateRangeAndProviderRangeGet(
      isProxyDataEntry!,
      isAutonomous!,
      serviceProviderProfile!.id!,
      stateInUs,
      startDate.startOf("day").subtract(UTCOffset, "hour").toDate(),
      endDate.endOf("day").subtract(UTCOffset, "hour").toDate(),
      filterSelectedProviderIdList(),
    )
      .then((res) => {
        if (res.postableSessionsLists) {
          const postableSessionsListsContainsOwnSessions: () => boolean = () => {
            return (
              res.postableSessionsLists?.findIndex(
                (postableSession) =>
                  postableSession.serviceProvider?.id === serviceProviderProfile?.id,
              ) !== -1
            );
          };
          /**
           * 2/6/24
           * v1SessionsPostableSessionsByDateRangeAndProviderRangeGet is currently returning submitted sessions for assistants
           * the filters below have been adjusted to account for that
           */
          if (
            postableSessionsListsContainsOwnSessions() &&
            !selectedProviderIds.includes(serviceProviderProfile!.id!)
          ) {
            const filteredPostableSessionsLists = res.postableSessionsLists.filter(
              (postableSession) => {
                if (isAssistant()) {
                  return (
                    postableSession.serviceProvider?.id !== serviceProviderProfile?.id &&
                    postableSession.status !== undefined &&
                    postableSession.status < 2
                  );
                } else {
                  return postableSession.serviceProvider?.id !== serviceProviderProfile?.id;
                }
              },
            );
            setSessions(filteredPostableSessionsLists);
          } else {
            if (isAssistant()) {
              setSessions(
                res.postableSessionsLists.filter(
                  (postableSession) =>
                    postableSession.status !== undefined && postableSession.status < 2,
                ),
              );
            } else {
              setSessions(res.postableSessionsLists);
            }
          }
          setIsLoading(false)
        }
      })
      .catch(console.log);
  };

  useEffect(() => {
    /**
     * Changing the year value in the date range picker with your keyboard turns the
     * startDate or endDate into an invalid date object, which was breaking the app and loading the error screen
     * This page helped me with a solution: https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
     */
    if (isNaN(Date.parse(`${startDate.toDate()}`)) || isNaN(Date.parse(`${endDate.toDate()}`))) {
      return;
    }
    if (Date.parse(`${startDate.toDate()}`) > Date.parse(`${endDate.toDate()}`)) {
      return;
    }

    getPostableSessionsByDateRangeAndProviderRangeGet();
  }, [startDate, endDate, selectedProviderIds]);

  useEffect(() => {
    // TODO: client side filtering by campus
    if (selectedStudentIds.length)
      setFilteredSessions(
        sessions.filter(
          (session) =>
            session.studentJournalList?.some(
              ({ student }) => student?.id && selectedStudentIds.includes(student.id),
            ),
        ),
      );
    else setFilteredSessions(sessions);
  }, [selectedStudentIds]);

  useEffect(() => {
    setStudents(() => {
      let allStudents: Student[] = [];
      sessions.map(
        (session) =>
          session.studentJournalList?.map(
            ({ student }) =>
              student &&
              (allStudents.some((member) => member.id === student.id) || allStudents.push(student)),
          ),
      );
      setSelectedStudentIds(allStudents.map(({ id }) => id!));

      return allStudents;
    });

    setSelectedSessionIds((selectedSessionIds) =>
      selectedSessionIds.filter((id) => sessions.find((session) => session.id === id)),
    );
  }, [sessions]);

  return (
    <UnpostedSessionsBatchPostContext.Provider
      value={{
        stateInUs,
        sessions: filteredSessions,
        selectedSessionIds,
        selectedSessionIndexes,
        onSelectSession: handleSelectSession,
        onSelectAllSessions: handleSelectAllSessions,
        startDate,
        endDate,
        providers,
        selectedProviderIds,
        campuses,
        selectedCampusIds,
        students,
        selectedStudentIds,
        onChangeDateRange: handleChangeDateRange,
        onChangeSelectedProviderIds: handleChangeSelectedProviderIds,
        onChangeSelectedCampusIds: handleChangeSelectedCampusIds,
        onChangeSelectedStudentIds: handleChangeSelectedStudentIds,
        refresh: refresh,
        isLoading,
        isPosting,
        setIsPosting,
      }}
    >
      {children}
    </UnpostedSessionsBatchPostContext.Provider>
  );
};

export const useUnpostedSessionsBatchPostContext = () =>
  useContext(UnpostedSessionsBatchPostContext);

export default UnpostedSessionsBatchPostProvider;
