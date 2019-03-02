import React from "react";
import App from "./components/App";
import typography from "./services/typography";
import { TypographyStyle, GoogleFont } from "react-typography";

const Root = props => {
  return (
    <>
      <TypographyStyle typography={typography} />
      <GoogleFont typography={typography} />
      <App />
    </>
  );
};

export default Root;
