/**
 * Removes duplicate values from any array when passed directly to a JS `.filter()` function.
 * @example serviceAreas.filter(onlyUnique);
 */
export function onlyUnique(value: any, index: number, array: any[]) {
  return array.indexOf(value) === index;
}
