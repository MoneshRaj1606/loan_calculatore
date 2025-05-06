import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ExchangeRates from "./pages/ExchangeRates";
import About from "./pages/About";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
         
 
      <Routes>
      <Route element={<Header />}>
        <Route path="/" element={<Home />} />
        <Route path="/exchange" element={<ExchangeRates />} />
        <Route path="/about" element={<About />} />
   </Route>
        
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
     
      </Routes>
    </Router>
  );
};

export default App;