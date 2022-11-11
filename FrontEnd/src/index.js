import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

/* react router dom */
import { BrowserRouter } from "react-router-dom";

/* redux, react-redux */
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./Modules";

/* scroll to top */
import ScrollToTop from "./Components/ScrollToTop";

/* loading Page */
import { GlobalStyle } from "styles/globalStyle";
/* redux setting */
const store = createStore(rootReducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyle />
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
