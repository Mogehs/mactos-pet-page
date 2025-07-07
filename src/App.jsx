import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import GetLostPet from "./GetLostPet";

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster />
        <Routes>
          <Route path="/pet/:id" element={<GetLostPet />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
