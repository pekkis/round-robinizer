import Typography from "typography";

const typography = new Typography({
  includeNormalize: true,
  baseFontSize: "18px",
  baseLineHeight: 1.45,
  headerFontFamily: ["Open Sans", "sans-serif"],
  bodyFontFamily: ["Open Sans", "sans-serif"],
  googleFonts: [
    {
      name: "Open Sans",
      styles: ["400", "400i", "700", "700i"]
    }
  ]
});

export default typography;
