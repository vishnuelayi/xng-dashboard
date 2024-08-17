import { ReactComponent as XLogsLogoSvg } from "../svgs/logo.svg";

export type LogoSize = "xl";

function XLogsLogo(props: { size: LogoSize }) {
  const SIZE = props.size ? props.size : "xl";

  switch (SIZE) {
    case "xl":
      return <XLogsLogoSvg width={200} height={72} />;
  }
}

export default XLogsLogo;
