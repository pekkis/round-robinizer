import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";

/*
import { createStore } from "./services/redux";
import { getMiddlewares, getReducers, getEnhancers } from "./config/redux";
import { getInitialState } from "./config/state";
*/

/*
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
library.add(faSpinner);
*/

const initialState = undefined;

/*
const initialState = getInitialState();

const store = createStore(
  getReducers(),
  getMiddlewares(),
  getEnhancers(),
  initialState
);
*/

// Just a small DRY abstraction here.
function render(Component, rootElement, method = "render") {
  ReactDOM[method](<Component />, rootElement);
}

// If we get !undefined state from the server, we hydrate.
const rootElement = document.getElementById("app");
render(Root, rootElement, initialState ? "hydrate" : "render");

// Webpack's hot reloading magic happens here.
if (module.hot) {
  module.hot.accept("./Root", () => {
    const HotReloadedRoot = require("./Root").default;
    render(HotReloadedRoot, rootElement, "render");
  });
}

console.log("In the browser console, also suckling on a duckling?!?");
