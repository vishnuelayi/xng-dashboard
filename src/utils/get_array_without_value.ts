export default function getArrayWithoutValue<T>(array: T[], v: T): T[] {
  const arr = [...array];
  const index = arr.indexOf(v, 0);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
