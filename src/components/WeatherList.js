import React from "react";

const WeatherList = ({ forecastDays = [] }) => {
  return (
    <ul className="forecast">
      {forecastDays.map(({ date, day }) => (
        <li key={date}>
          <h6>{date}</h6>
          <img
            src={day.condition.icon}
            title={day.condition.text}
            alt={day.condition.text}
          />
          <h6>{day.avgtemp_c} &#8451;</h6>
          <p>{day.condition.text}</p>
        </li>
      ))}
    </ul>
  );
};

export default WeatherList;
