import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import Login from "./pages/Login";
import Users from "./pages/Users/Users";
import Survey from "./pages/Survey/Survey";
import Surveys from "./pages/Surveys/Surveys";
import Questions from "./pages/Questions/Questions";
import NoPage from "./pages/NoPage";
import SurveyMaker from "./pages/SurveyMaker/SurveyMaker";
import Menu from "./pages/Menu";
import ProtectedRoutes from "./components/Comp Niels/ProtectedRoutes";
import MakeSurvey from "./pages/MakeSurvey/MakeSurvey";

export const UserContext = createContext();

export default function App() {
  const [user, setUser] = useState({ loggedIn: false });
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Login />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="menu" element={<Menu />} />
              <Route path="users" element={<Users />} />
              <Route path="survey" element={<Surveys />} />
              <Route path="survey/:id" element={<Survey />} />
              <Route path="questions" element={<Questions />} />
              <Route path="survey-maker" element={<SurveyMaker />} />
              <Route path="make-survey/:id" element={<MakeSurvey />} />
            </Route>
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
