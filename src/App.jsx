import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [cityName, setCityName] = useState("");
  const [apiResponse, setApiResponse] = useState({});
  const [icon, setIcon] = useState("");

  const APIKEY = `1a208d48d95748f4ac72f02def549960`;

  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const getCurrentLocationWeather = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`
      );
      setApiResponse(response.data);
      setIcon(response.data.weather[0].icon);
    } catch (error) {
      alert(`Failed to fetch weather from coordinate. ${error.message}`);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude);
          getCurrentLocationWeather(latitude, longitude);
        },
        (error) => alert(error.message)
      );
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const fetchData = async () => {
    if (!cityName.trim()) {
      alert("Please enter a city name.");
      return;
    }
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKEY}&units=metric`
      );
      setApiResponse(response.data);
      setIcon(response.data.weather[0].icon);
      console.log(response.data);
      setCityName("");
    } catch (error) {
      alert(`${cityName} not found. Enter Correct City Name please.`,error.message);
    }
  };
  return (
    <>
      <div className="w-full h-dvh flex justify-center items-center  px-4 md:px-8">
        <div className="border-5 border-white rounded-2xl p-4 data-container flex-wrap overflow-hidden">
          <input
            required
            type="text"
            placeholder="Enter any City Name"
            className="rounded-2xl outline-none p-4 bg-cyan-50 mr-1 w-full"
            value={cityName}
            onChange={(e) => {
              setCityName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchData();
              }
            }}
          />
          <button className="button-6" onClick={fetchData}>
            Search
          </button>
          <div>
            <h1 className="text-6xl mt-1">
              <b>{apiResponse.name}</b>
            </h1>
            <b>{date}</b>
            <div className="flex justify-between relative">
              {icon ? (
                <img
                  className="w-3/5"
                  src={`https://openweathermap.org/img/w/${icon}.png`}
                />
              ) : null}
              {apiResponse.main ? (
                <div className="absolute bottom-9 right-4">
                  <b className="text-5xl">
                    {Math.round(apiResponse?.main?.temp)}
                  </b>
                  °C{" "}
                  <div className="text-sm">{apiResponse.weather[0].main}</div>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col justify-center text-center gap-1">
              <h1 className="text-2xl font-bold">Precipitation</h1>
              {apiResponse.main ? (
                <div className="flex justify-between gap-8">
                  <div>
                    <b>Max:</b> {apiResponse.main.temp_max}°C{" "}
                  </div>
                  <div>
                    <b>Min:</b> {apiResponse.main.temp_min}°C{" "}
                  </div>
                </div>
              ) : null}
              {apiResponse.main ? (
                <div>
                  <b>Feels Like:</b> {apiResponse.main.feels_like}°C{" "}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              {apiResponse.main ? (
                <div className="border-2 border-gray-400 rounded-b-lg pl-4 py-2 shadow-xl/30 bg-emerald-100">
                  Humidity : {apiResponse.main.humidity}%
                </div>
              ) : null}

              {apiResponse.main ? (
                <div className="border-2 border-gray-400 rounded-b-lg pl-4 py-2 shadow-xl/30 bg-emerald-100">
                  Wind : {apiResponse.wind.speed}km/h
                </div>
              ) : null}

              {apiResponse.main ? (
                <div className="border-2 border-gray-400 rounded-b-lg pl-4 py-2 shadow-xl/30 bg-emerald-100">
                  Clouds : {apiResponse.clouds.all}%
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
