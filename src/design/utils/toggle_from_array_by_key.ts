export default function toggleFromArrayByKey<T>(item: T, array: T[], key: keyof T): T[] {
  if (Boolean(array.find((a) => a[key] === item[key]))) {
    const res = array.filter((_item) => {
      return _item[key] !== item[key];
    });
    return res;
  } else {
    const res = [...array, item];
    return res;
  }
}
