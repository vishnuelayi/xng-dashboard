import React, { createContext, useContext, useEffect, useState } from "react";
import { DistrictOfLiability, SchoolCampusAssignment, StudentResponse } from "../../../profile-sdk";
import { EditStudentFunctionType } from "../types";
import { produce } from "immer";
import { placeholderForFutureLogErrorText } from "../../../temp/errorText";
import { API_DISTRICTS, API_STUDENTS } from "../../../api/api";
import { useXNGSelector } from "../../../context/store";
import { selectStateInUS } from "../../../context/slices/stateInUsSlice";
import { selectClientID } from "../../../context/slices/loggedInClientSlice";
import { selectAuthorizedDistricts, selectUser } from "../../../context/slices/userProfileSlice";

/**
 * Note if trying to reference from an external module: Use `useStudentProfileContext` instead
 */
const EditedStudentContext = createContext<StudentProfileContextType | null>(null);
interface StudentProfileContextType {
  editedStudent: StudentResponse | null;
  editStudent: EditStudentFunctionType;
  editStudentImmer: EditStudentFunctionType;
  setEditedStudent: React.Dispatch<React.SetStateAction<StudentResponse | null>>;
  student: StudentResponse | null;
  sortedDistricts: string[];
  selectedStudentDistrict?: DistrictOfLiability;
  setSelectedStudentDistrictHandler: (district: DistrictOfLiability) => void;
  selectedStudentCampus?: SchoolCampusAssignment;
  setSelectedStudentCampusHandler: (campus: SchoolCampusAssignment) => void;
  handleSave: (v?: StudentResponse) => Promise<void>;
  isSaving: boolean;
  state: string;
}

export const StudentProfileContextProvider = (props: { children: React.ReactNode }) => {
  const [editedStudent, setEditedStudent] = useState<StudentResponse | null>(null);

  const state = useXNGSelector(selectStateInUS);
  const loggedInClientId = useXNGSelector(selectClientID);
  const districts = useXNGSelector(selectAuthorizedDistricts);
  const user = useXNGSelector(selectUser);

  const [student, setStudent] = useState<StudentResponse | null>(null);
  // const [studentCampus, setStudentCampus] = useState<string>("");
  const [selectedStudentDistrict, setSelectedStudentDistrict] = useState<DistrictOfLiability | undefined>();
  const [selectedStudentCampus, setSelectedStudentCampus] = useState<SchoolCampusAssignment | undefined>();
  const [sortedDistricts, setSortedDistricts] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);


  /**
   * NOTE: This function has been deprecated in favor of Immer's `produce()` function.
   *
   */
  function editStudent(prop: string, value: any): void {
    const pathArray = prop.split(".");
    const copy: StudentResponse = { ...editedStudent } as StudentResponse;
    let currentObject: any = copy;
    for (let i = 0; i < pathArray.length - 1; i++) {
      currentObject = currentObject[pathArray[i]];
    }
    currentObject[pathArray[pathArray.length - 1]] = value;
    setEditedStudent(copy);
  }

  /**
   * This function exists for debugging. By using this in place of existing dot notation patterns,
   * underlying issues can more easily be revealed.
   */
  function editStudentImmer(prop: string, value: any): void {
    // Use Immer's produce to create a new state
    const newState = produce(editedStudent, (draft) => {
      let current = draft as any;
      const pathArray = prop.split(".");

      // Traverse the path and update the value
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }
      current[pathArray[pathArray.length - 1]] = value;
    });

    // Update the state with the new immutable state
    setEditedStudent(newState);
  }

  async function handleSave(v?: StudentResponse) {
    setIsSaving(true);
    // Save student, refresh screen.
    if (!editedStudent) throw new Error(placeholderForFutureLogErrorText);
    const studentID = document.URL.split("/").at(-1);
    const newEditedStudent = produce(editedStudent, (draft) => {
      if (selectedStudentDistrict)
        draft.districtOfLiabilityRecords = [
          selectedStudentDistrict,
          ...(draft.districtOfLiabilityRecords ?? []),
        ];
      if (selectedStudentCampus)
        draft.schoolCampuses = [selectedStudentCampus, ...(draft.schoolCampuses ?? [])];
    });

    await API_STUDENTS.v1StudentsIdPatch(studentID!, state, v ?? newEditedStudent);
    fetchAndSetStudent();
    setIsSaving(false);
  }

  async function fetchAndSetStudent() {
    const studentID = document.URL.split("/").at(-1);
    const s = await API_STUDENTS.v1StudentsIdGet(studentID!, loggedInClientId!, state);

    setSelectedStudentDistrict(s.districtOfLiabilityRecords?.[0]); //initialize selected district to the first district in record
    setSelectedStudentCampus(s.schoolCampuses?.[0]); //initialize selected campus to the first campus in record

    const sorted_districts: string[] = districts
      .map((district) => {
        return district.name!;
      })
      .sort((a, b) => a.localeCompare(b));

    setSortedDistricts(sorted_districts);

    setStudent(s);
    setEditedStudent(s);
  }

  function setSelectedStudentDistrictHandler(district: DistrictOfLiability) {
    setSelectedStudentDistrict(district);
  }

  function setSelectedStudentCampusHandler(campus: SchoolCampusAssignment) {
    setSelectedStudentCampus(campus);
  }

  useEffect(() => {
    fetchAndSetStudent();
  }, []);

  const value: StudentProfileContextType = {
    editedStudent,
    editStudent,
    setEditedStudent,
    editStudentImmer,
    selectedStudentDistrict,
    setSelectedStudentDistrictHandler,
    selectedStudentCampus,
    setSelectedStudentCampusHandler,
    student,
    sortedDistricts,
    handleSave,
    isSaving,
    state,
  };

  return (
    <EditedStudentContext.Provider value={value}>{props.children}</EditedStudentContext.Provider>
  );
};

export function useStudentProfileContext(): StudentProfileContextType {
  const context = useContext(EditedStudentContext);
  if (!context) {
    throw new Error("useStudentProfileContext must be used within a EditedStudentProvider");
  }
  return context;
}
