export const hasCommonItem = (arr1: any, arr2: any) => {
  return arr1.filter((item: any) => arr2.includes(item)).length > 0;
};
