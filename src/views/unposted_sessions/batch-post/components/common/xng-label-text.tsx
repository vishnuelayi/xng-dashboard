import Typography, { type TypographyProps } from "@mui/material/Typography";

interface XNGLabelTextProps extends TypographyProps {
  label: string;
  text?: string;
  size?: "big" | "medium" | "small";
}

export default function XNGLabelText({
  label,
  text,
  size = "small",
  ...otherProps
}: XNGLabelTextProps) {
  const fontSizeMap = {
    big: "16px",
    medium: "14px",
    small: "12px",
  };

  return (
    <Typography
      sx={{ fontSize: fontSizeMap[size], lineHeight: "20px", fontWeight: 400 }}
      {...otherProps}
    >
      <Typography
        sx={{ fontSize: fontSizeMap[size], lineHeight: "20px", fontWeight: 700 }}
        component="span"
      >
        {label}
      </Typography>
      {text}
    </Typography>
  );
}
