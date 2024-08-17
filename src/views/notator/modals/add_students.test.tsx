import { StudentRef } from "../../../profile-sdk";
import { StudentJournal } from "../../../session-sdk";
import { getStudentsNotInSession } from "./add_students";

describe("getStudentsNotInSession", () => {
  it("Should only return students not in any journal entries", () => {
    const mockCaseload: StudentRef[] = [
      { id: "1", firstName: "John", lastName: "Doe" },
      { id: "2", firstName: "Jane", lastName: "Doe" },
      { id: "3", firstName: "Jim", lastName: "Beam" },
    ];
    const mockJournals: StudentJournal[] = [{ student: { id: "1" } }, { student: { id: "3" } }];

    const expectedResult = [{ id: "2", firstName: "Jane", lastName: "Doe" }];

    const result = getStudentsNotInSession({ journals: mockJournals, caseload: mockCaseload });

    expect(result).toEqual(expectedResult);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });
});
