import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateBattle } from "./pages";
import { GlobalContextProvider } from "./context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GlobalContextProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create" element={<CreateBattle />} />
      </Routes>
    </GlobalContextProvider>
  </BrowserRouter>
);
