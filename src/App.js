import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import WeatherForecast from "./components/WeatherForecast";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WeatherForecast />} />
      <Route path="/weather/:slug" element={<WeatherForecast />} />
    </Routes>
  );
};

export default App;
