/**
 * Generates an array of week ranges between the specified start and end years.
 *
 * @param yearStart - The starting year.
 * @param yearEnd - The ending year.
 * @returns An array of objects representing the start and end dates of each week, along with the week number.
 */
function generateWeeks(yearStart: number, yearEnd: number): WeekRangeType[] {
  let weeks = [];
  let startDate = new Date(yearStart, 0, 1); // Start from Jan 1 of start year
  let endDate = new Date(yearEnd, 11, 31); // End at Dec 31 of end year
  let weekNumber = 1; // Initialize week number

  while (startDate < endDate) {
    let weekStart = new Date(startDate);
    let weekEnd = new Date(startDate);
    weekEnd.setDate(weekEnd.getDate() + 6); // A week is 7 days

    // If the week extends into the next year, truncate it to end on Dec 31
    if (weekEnd.getFullYear() > startDate.getFullYear()) {
      weekEnd = new Date(startDate.getFullYear(), 11, 31);
    }

    weeks.push({ start: weekStart, end: weekEnd, week_number: weekNumber });

    // Move to the next week
    startDate.setDate(startDate.getDate() + 7);
    weekNumber++;
  }

  return weeks;
}

/**
 * Represents a range of dates for a week.
 */
export type WeekRangeType = {
  start: Date;
  end: Date;
  week_number?: number;
};

export default generateWeeks;
