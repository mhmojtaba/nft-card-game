import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Battle, Battleground, CreateNewBattle, JoinBattle } from "./pages";
import { GlobalContextProvider } from "./context";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GlobalContextProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create-battle" element={<CreateNewBattle />} />
        <Route path="/join-battle" element={<JoinBattle />} />
        <Route path="/battleground" element={<Battleground />} />
        <Route path="/battle/:battleName" element={<Battle />} />
      </Routes>
      <Toaster />
    </GlobalContextProvider>
  </BrowserRouter>
);
