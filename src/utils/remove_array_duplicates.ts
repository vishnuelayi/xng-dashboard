const removeArrayDuplicates = <T extends {}>(
  arr: T[],
  compareProp: (item: T) => keyof typeof item | (keyof typeof item)[],
) => {
  const uniqueArr = arr.filter(
    (item, index, self) =>
      index ===
      self.findIndex((t) => {
        const prop = compareProp(t);
        return typeof prop === "object"
          ? prop.some((p) => t[p] === item[p])
          : t[prop] === item[prop];
      }),
  );
  return uniqueArr;
};

export default removeArrayDuplicates;
