import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import WeatherList from "./WeatherList";
import { formatDate, joinByComma } from "../utils/helpers";
import { Col, Container, Row } from "reactstrap";
import SearchBar from "./SearchBar";

const currentDate = new Date();

// Calculate yesterday's date
const yesterday = new Date(currentDate);
yesterday.setDate(currentDate.getDate() - 1);

// Calculate 7 days before yesterday
const sevenDaysBeforeYesterday = new Date(yesterday);
sevenDaysBeforeYesterday.setDate(yesterday.getDate() - 6);

// Format the dates
const yesterdayFormatted = formatDate(yesterday);
const sevenDaysBeforeYesterdayFormatted = formatDate(sevenDaysBeforeYesterday);

const getIpAddress = async () => {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    return await res.json();
  } catch (error) {
    alert("Could not get the IP address.");
  }
};

const WeatherForecast = () => {
  const ip = useRef();
  const [weatherForecast, setWeatherForecast] = useState();
  const [weatherHistory, setWeatherHistory] = useState();
  const { slug } = useParams();

  const getWeatherForecast = async ({ q = slug ?? ip.current, days = 8 }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/forecast.json?q=${q}&days=${days}&key=${process.env.REACT_APP_API_KEY}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message);
      setWeatherForecast(data);
    } catch (error) {
      alert(error?.message || "Could not get the weather forecast");
    }
  };

  const getWeatherHistory = async ({
    q = slug ?? ip.current,
    date = sevenDaysBeforeYesterdayFormatted,
    endDate = yesterdayFormatted,
  }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/history.json?q=${q}&dt=${date}&end_dt=${endDate}&key=${process.env.REACT_APP_API_KEY}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message);
      setWeatherHistory(data);
    } catch (error) {
      alert(error?.message || "Could not get the weather forecast");
    }
  };

  useEffect(() => {
    if (slug) {
      getWeatherForecast({ q: slug });
      getWeatherHistory({ q: slug });
    } else {
      // Get the IP address to get weather forecast of current location
      getIpAddress()
        .then((res) => {
          ip.current = res.ip;
          return res.ip;
        })
        .then((ip) => {
          getWeatherForecast({ q: ip });
          getWeatherHistory({ q: ip });
        });
    }
  }, [slug]);

  return (
    <div className="weather-wrapper">
      <Container>
        <Row>
          <Col lg={4}>
            <div className="weather-search-info">
              <SearchBar />
              {weatherForecast ? (
                <>
                  <div className="current-weather">
                    <h1>
                      {weatherForecast.current.temp_c} &#8451; /{" "}
                      {weatherForecast.current.temp_f} &#8457;
                    </h1>
                    <img
                      src={weatherForecast.current.condition.icon}
                      title={weatherForecast.current.condition.text}
                      alt={weatherForecast.current.condition.text}
                    />
                  </div>
                  <h4 className="mb-sm-4 mb-3">
                    {joinByComma(
                      weatherForecast.location?.name,
                      weatherForecast.location?.country
                    )}
                  </h4>
                  <h6>Weather: {weatherForecast.current.condition.text}</h6>
                  <h6>Wind: {weatherForecast.current.wind_kph} kmph</h6>
                </>
              ) : null}
            </div>
          </Col>
          <Col lg={8}>
            {weatherForecast ? (
              <div>
                <div className="weather-forecast-box">
                  <h2>7 days weather forecast</h2>
                  <WeatherList
                    forecastDays={weatherForecast.forecast.forecastday.slice(1)}
                  />
                </div>

                {weatherHistory ? (
                  <div className="weather-forecast-box">
                    <h2>Last 7 days weather</h2>
                    <WeatherList
                      forecastDays={weatherHistory.forecast.forecastday}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>

      {/* Background video */}
      <div className="bg-video">
        <video autoPlay muted loop>
          <source src="/bg_video.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default WeatherForecast;
