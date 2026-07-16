import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { persistor, store } from "./store/store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { I18nextProvider } from "react-i18next";
import i18n from "./views/shared/translator/i18n";
import { ConfigProvider } from "./Berry/contexts/ConfigContext";
import ThemeCustomization from "./Berry/themes/index";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <I18nextProvider i18n={i18n}>
            <ConfigProvider>
              <ThemeCustomization>
                <Router>
                  <App />
                </Router>
              </ThemeCustomization>
            </ConfigProvider>
          </I18nextProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
} else {
  throw new Error("Root element not found");
}

reportWebVitals();
