function toggleFromArray<T>(item: T, array: T[]): T[] {
  // #TODO
  /**
   * This could be its own utility function but it needs more logic safeguards and type safety
   * This function and the first if statement below were added in a hurry to unblock production
   */
  const deepEqual = (object1: T, object2: T) => {
    return (
      // @ts-ignore
      Object.entries(object1).sort().toString() === Object.entries(object2).sort().toString()
    );
  };

  const containsDuplicateObjects = array.filter((fitem) => deepEqual(item, fitem)).length > 0;

  if (
    array.length > 0 &&
    typeof array[0] === "object" &&
    !Array.isArray(array[0]) &&
    containsDuplicateObjects
  ) {
    return array.filter((fitem) => !deepEqual(item, fitem));
  }

  if (array.includes(item)) {
    const res = array.filter((fitem) => {
      return fitem !== item;
    });
    return res;
  } else {
    const res = [...array, item];
    return res;
  }
}

export default toggleFromArray;
