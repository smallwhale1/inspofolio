import "@mui/material/styles";
import {
  PaletteColor,
  PaletteColorOptions,
  createTheme,
} from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    textColor: PaletteColor;
    bgColor: PaletteColor;
    textGrey: PaletteColor;
    blue500: PaletteColor;
    grey50: PaletteColor;
    grey100: PaletteColor;
    grey200: PaletteColor;
    grey300: PaletteColor;
    grey400: PaletteColor;
    grey500: PaletteColor;
    grey600: PaletteColor;
    grey700: PaletteColor;
    grey800: PaletteColor;
    grey900: PaletteColor;
    grey950: PaletteColor;
  }

  interface PaletteOptions {
    textColor: PaletteColorOptions;
    bgColor: PaletteColorOptions;
    textGrey: PaletteColorOptions;
    blue500?: PaletteColorOptions;
    grey50?: PaletteColorOptions;
    grey100?: PaletteColorOptions;
    grey200?: PaletteColorOptions;
    grey300?: PaletteColorOptions;
    grey400?: PaletteColorOptions;
    grey500?: PaletteColorOptions;
    grey600?: PaletteColorOptions;
    grey700?: PaletteColorOptions;
    grey800?: PaletteColorOptions;
    grey900?: PaletteColorOptions;
    grey950?: PaletteColorOptions;
  }
}

// Tailwind Zinc line

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#f25771",
    },
    secondary: {
      main: "#18181b",
    },
    textGrey: {
      main: "#52525b",
    },
    textColor: { main: "#18181b" },
    bgColor: { main: "#fbf7f0" },
    blue500: {
      main: "#3b82f6",
    },
    grey50: {
      main: "#fafafa",
    },
    grey100: {
      main: "#f4f4f5",
    },
    grey200: {
      main: "#e4e4e7",
    },
    grey300: {
      main: "#d4d4d8",
    },
    grey400: {
      main: "#a1a1aa",
    },
    grey500: {
      main: "#71717a",
    },
    grey600: {
      main: "#52525b",
    },
    grey700: {
      main: "#3f3f46",
    },
    grey800: {
      main: "#27272a",
    },
    grey900: {
      main: "#18181b",
    },
    grey950: {
      main: "#09090b",
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          "&:not(.Mui-selected):not(:hover)": {},
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // color: "#ffffff",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {},
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#000000",
    },
    textGrey: {
      main: "#71717a",
    },
    textColor: { main: "#ffffff" },
    bgColor: { main: "#000000" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {},
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {},
      },
    },
  },
});
