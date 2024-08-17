/**
 * Type alias for enums since TypeScript doesn't expose one.
 */
type TypeScriptEnum = { [index: string]: number | string };

/**
 * Converts an enum into an array of its own numeric enum values.
 * This is particularly useful for CRUD form development. We can have Fortitude components use a BE
 * enum as the `T` parameter and directly feed its onChange value to the draft update, minimizing
 * abstraction.
 *
 * In the example below, we have a dropdown that allows a user to pick between three options. The onChange
 * will update the draft with the newly selected option (a numeric value associated with the enum selection)
 * using the returned `v` directly.
 *
 * @example
 * function ObservationSelect() {
 *   const options = useMemo(() => enumAsArrayOfValues(GoalAndObjectiveObservation), []); // Returns [0, 1, 2]
 *
 *   const labelFromGoalAndObjectiveObservation: Record<GoalAndObjectiveObservation, string> = {
 *     [GoalAndObjectiveObservation.NUMBER_0]: "None",
 *     [GoalAndObjectiveObservation.NUMBER_1]: "Discontinued",
 *     [GoalAndObjectiveObservation.NUMBER_2]: "Mastered",
 *   };
 *
 *   return (
 *     <MSBTypedSelectControlled<GoalAndObjectiveObservation>
 *       options={options}
 *       getOptionLabel={(v) => labelFromGoalAndObjectiveObservation[v]}
 *       onChange={(v) => {draft.deeplyNestedField.observation = v}} // (PSEUDOCODE) Update the draft directly with
 *                                                                   // numeric enum value `v`, possibly with Immer
 *
 *       {...remainingcode}
 *     />
 *   );
 * }
 */
export function enumAsArrayOfValues<T extends TypeScriptEnum>(enumType: T): T[keyof T][] {
  return Object.values(enumType).filter((value) => !isNaN(Number(value))) as T[keyof T][];
}
