import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CreateProject from "./components/CreateProject";
import Projects from "./components/Projects";
import ProjectMembers from "./components/ProjectMembers";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/projects/new" element={<CreateProject />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:projectId/members" element={<ProjectMembers />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
