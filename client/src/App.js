import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Pages/Auth/Login"
import Register from "./Pages/Auth/Register"
import Project from "./Pages/Main/Home"
import Document  from "./Pages/Doc/document";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/projects" element={<Project />}/>
      <Route path="/projects/document" element={<Document />}/>



    </Routes>
  )
}

export default App