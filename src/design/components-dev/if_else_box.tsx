function IfElseBox(props: { if: boolean; then: JSX.Element; else?: JSX.Element }): JSX.Element {
  return props.if ? props.then : props.else!;
}

export default IfElseBox;
