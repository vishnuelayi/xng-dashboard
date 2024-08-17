import React from 'react'
import { Student } from '../../../../session-sdk';

const useSelectedStudentsHandler = (props: {
  onChangeSelectedStudentIds: (selectedProviderIds: string[]) => void,
  students: Student[],
}) => {
  const { onChangeSelectedStudentIds, students } = props
  const [selectedStudents, setSelectedStudents] = React.useState(students);
  const [deseletedStudents, setDeselectedStudents] = React.useState<Student[]>([]);

  React.useEffect(() => {
    let updatedDeselectedStudentsState = deseletedStudents;

    // Remove deselected students that are no longer in the options
    deseletedStudents.forEach(deselected => {
      const isAnOption = !!students.find((s) => s.id === deselected.id);
      if (!isAnOption) {
        setDeselectedStudents((prev) => {
          const updatedDeselectedStudents = prev.filter((s) => s.id !== deselected.id);
          return updatedDeselectedStudents;
        });
      }
    });

    //  update selected students to remove students that are now in the deselected array to persist deselection
    const updatedSelectedStudents = students.filter((s) => {

      const optionContainedDeselectedstudent = updatedDeselectedStudentsState.find((student) => student.id === s.id);

      return !Boolean(optionContainedDeselectedstudent);
    });
    setSelectedStudents(updatedSelectedStudents);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students]);

  const setSelectedStudentsHandler = (selected: Student[]) => {
    setSelectedStudents(selected);
    setDeselectedStudentsHandler(selected)
    onChangeSelectedStudentIds(selected.map((s) => s.id || ""));
  };

  function setDeselectedStudentsHandler(selected: Student[]) {

    students.forEach(studentOption => {
      const isStudentSelected = !!selected.find((s) => s.id === studentOption.id);
      const hasBeenAddedToDeselectedArray = !!deseletedStudents.find((s) => s.id === studentOption.id);

      if (!isStudentSelected && !hasBeenAddedToDeselectedArray) {
        setDeselectedStudents((prev) => prev.concat(studentOption));
      }
      else if (isStudentSelected && hasBeenAddedToDeselectedArray) {
        setDeselectedStudents((prev) => prev.filter((s) => s.id !== studentOption.id));
      }
    });
  }

  return { selectedStudents, setSelectedStudents: setSelectedStudentsHandler }
}

export default useSelectedStudentsHandler