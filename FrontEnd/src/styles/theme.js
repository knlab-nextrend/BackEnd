import { myColors, tailwindColors } from "./colors";

export const theme = {
  base: tailwindColors,
  "base-100": tailwindColors.white,
  "base-200": tailwindColors["grey-200"],
  "base-300": tailwindColors["grey-300"],
  "base-400": tailwindColors["grey-400"],
  "base-500": tailwindColors["grey-500"],
  "base-content": tailwindColors["grey-900"],

  primary: myColors.blue400,
  "primary-focus": myColors.blue500,
  "primary-content": tailwindColors.white,

  secondary: tailwindColors,
  "secondary-focus": tailwindColors,
  "secondary-content": tailwindColors,

  accent: tailwindColors,
  "accent-focus": tailwindColors,
  "accent-content": tailwindColors,

  info: tailwindColors,
  "info-focus": tailwindColors,
  "info-content": tailwindColors,

  success: tailwindColors,
  "success-focus": tailwindColors,
  "success-content": tailwindColors,

  warning: tailwindColors,
  "warning-focus": tailwindColors,
  "warning-content": tailwindColors,

  error: tailwindColors,
  "error-focus": tailwindColors,
  "error-content": tailwindColors,
};
