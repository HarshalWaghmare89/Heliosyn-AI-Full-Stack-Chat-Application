import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";

import { ChatProvider } from "./shared/context/ChatContext";
import { HelmetProvider } from "react-helmet-async";

import "./styles/globals.css";

import "katex/dist/katex.min.css";
import "./styles/markdown.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </HelmetProvider>
  </StrictMode>,
);
