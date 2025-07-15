import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import QrCode from "./QrCode";

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster />
        <Routes>
          <Route path="/qr/:id" element={<QrCode />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
