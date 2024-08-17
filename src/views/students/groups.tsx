import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SidebarLayout from "../../layouts/SidebarLayout";
import { getStudentProfileTable } from "../../temp/getTable";
import { STUDENTS_SIDEBAR } from "./_";
import { getSizing } from "../../design/sizing";
import XNGButton from "../../design/low-level/button";
import Box from "../../design/components-dev/BoxExtended";

interface IName {
  Name: string;
}

interface IDMGroups {
  students: IName[];
}

function StudentGroups() {
  const DISPLAY_MODEL: IDMGroups = {
    students: [
      {
        Name: "BOB DOE",
      },
      {
        Name: "JOHN DOE",
      },
      {
        Name: "ROB DOE",
      },
      {
        Name: "JIM DOE",
      },
    ],
  };

  type Student = {
    id: string;
    name: string;
  };

  type Group = {
    id: string;
    name: string;
    students: Student[];
  };

  const initialStudents: Student[] = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Bob Johnson" },
    { id: "4", name: "Alice Williams" },
    { id: "5", name: "Mike Davis" },
    { id: "6", name: "Sara Lee" },
    { id: "7", name: "David Brown" },
    { id: "8", name: "Emily Jones" },
  ];

  const initialGroups: Group[] = [
    { id: "group-1", name: "Student List", students: [...initialStudents] },
    { id: "group-2", name: "Group 1", students: [] },
    { id: "group-3", name: "Group 2", students: [] },
    { id: "group-4", name: "Group 3", students: [] },
  ];

  const [temp, setTemp] = useState<string[]>([]);
  const [temp2, setTemp2] = useState<string[]>([]);

  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [students, setStudents] = useState<Student[]>(initialStudents);

  function thisDrag(e: React.DragEvent, x: string) {
    e.dataTransfer.setData("sname", x);
  }
  function thatDrop(e: React.DragEvent) {
    const x = e.dataTransfer.getData("sname") as string;
    setTemp2([...temp2, x]);
  }

  function thisDrop(e: React.DragEvent) {
    const x = e.dataTransfer.getData("sname") as string;
    setTemp([...temp, x]);
  }
  function thisDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceGroup = groups.find((group) => group.id === source.droppableId);
    const destGroup = groups.find((group) => group.id === destination.droppableId);

    if (!sourceGroup || !destGroup) {
      return;
    }

    const student = sourceGroup.students.find((student) => student.id === draggableId);

    if (!student) {
      return;
    }

    sourceGroup.students.splice(source.index, 1);
    destGroup.students.splice(destination.index, 0, student);

    setGroups([...groups]);
  };

  const addGroup = () => {
    // let x = groups.length + 1;
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <XNGButton onClick={addGroup} />
        {groups.map((group) => (
          <div key={group.id}>
            <h2>{group.name}</h2>
            <Droppable droppableId={group.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? "darkblue" : "white",
                    border: "1px solid black",
                  }}
                >
                  {group.students.map((student, index) => (
                    <Draggable key={student.id} draggableId={student.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            backgroundColor: snapshot.isDragging ? "lightblue" : "white",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {student.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
      <Box>
        <ul>
          {initialStudents.map((student) => {
            return (
              <li
                draggable
                onDragStart={(e) => {
                  thisDrag(e, student.name);
                }}
              >
                {student.name}
              </li>
            );
          })}
        </ul>
      </Box>
      <Box
        onDrop={thisDrop}
        onDragOver={thisDragOver}
        sx={{
          diplay: "flex",
          border: "1px solid black",
          width: "100%",
          height: "100%",
          background: "lightBlue",
        }}
      >
        <ul>
          {temp.map((x, index) => {
            return (
              <Box key={index}>
                <li
                  draggable
                  onDragStart={(e) => {
                    thisDrag(e, x);
                  }}
                >
                  {x}
                </li>
              </Box>
            );
          })}
        </ul>
      </Box>
      <Box
        onDrop={thatDrop}
        onDragOver={thisDragOver}
        sx={{
          diplay: "flex",
          border: "1px solid black",
          width: "100%",
          height: "100%",
          background: "lightBlue",
        }}
      >
        <ul>
          {temp2.map((x, index) => {
            return (
              <Box key={index}>
                <li
                  draggable
                  onDragStart={(e) => {
                    thisDrag(e, x);
                  }}
                >
                  {x}
                </li>
              </Box>
            );
          })}
        </ul>
      </Box>
    </>
  );
}

export default StudentGroups;
