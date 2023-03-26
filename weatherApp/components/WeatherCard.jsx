import React from "react";
import axios from "axios";

const WeatherCard = () => {
  const [cityName, setCityName] = React.useState({
    city: "",
  });
  const [cityData, setCityData] = React.useState({});

  const [weatherData, setWeatherData] = React.useState([]);
  const limit = 5;
  const key = "cf06300133c4452ccaa95bb3eb06f19b";
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName.city}&limit=${limit}&appid=${key}&units=imperial`;
  const [error, setError] = React.useState(null); // added error state

  const fetchData = async () => {
    try {
      const response = await axios.get(url);
      return setWeatherData(response.data);
    } catch (error) {
      return setError(error);
    } // handle error;
  };
  React.useEffect(() => {
    fetchData();
  }, [cityName.city]);

  const locationInfo = weatherData.map((place) => {
    if (
      place.country &&
      place.name &&
      place.state !== undefined
    ) {
      return `${place.country}, ${place.name}, ${place.state}`;
    }
    // return an empty string if the state property is undefined
    return `${place.country}, ${place.name}`;
  });

  const [location1, location2, location3] = locationInfo;

  function getLongLatitude(place) {
    const { lat, lon } = place;
    return { lat, lon };
  }

  function handleClick(place) {
    const { lat, lon } = getLongLatitude(place);
    const fetchAccurateData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`
        );
        setCityData(response.data);
        setCityName({ city: "" });
      } catch (error) {
        setError(error);
      } // handle error;
    };
    fetchAccurateData();
  }

  function handleCityNameChange(event) {
    event.preventDefault();
    setError(null); // reset error on input change
    setCityName((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  return (
    <div className="weather--card">
      <hr />
      <form className="input--form">
        <input
          type="text"
          name="city"
          placeholder="Enter City"
          onChange={handleCityNameChange}
          value={cityName.city}
        />
      </form>
      <br />
      {cityName.city !== "" && (
        <div className="city--selection ">
          <button
            type="button"
            onClick={() => handleClick(weatherData[0])}
          >
            {location1}
          </button>
          <button
            type="button"
            onClick={() => handleClick(weatherData[1])}
          >
            {location2}
          </button>
          <button
            type="button"
            onClick={() => handleClick(weatherData[2])}
          >
            {location3}
          </button>
        </div>
      )}
      <hr />
      <div className="main--day--container">
        <h3 className="city--name">
          Weather Data for {cityData.name && cityData.name}
        </h3>
        {/* <h3 className="current--date">{date}</h3> */}
      </div>
      <div className="temp--text">
        <h1 className="temp--data">
          {cityData.main && Math.floor(cityData.main.temp)}
          &deg;F
        </h1>
      </div>
      <div className="day--data--container">
        <h3 className="day-data description--data">
          Conditions:{" "}
          {cityData.weather &&
            cityData.weather[0].description}
        </h3>
        <h3 className="day-data temp--range">
          High Temperature:{" "}
          {cityData.main &&
            Math.floor(cityData.main.temp_max)}
          &deg;F
        </h3>
        <h3 className="day-data wind--data">
          Wind Speeds:{" "}
          {cityData.wind && Math.floor(cityData.wind.speed)}{" "}
          mph
        </h3>
        <h3 className="day-data precipitation--data">
          Low Temperature:{" "}
          {cityData.main &&
            Math.floor(cityData.main.temp_min)}
          &deg;F
        </h3>
      </div>
      {/* {error && <p className="error">{error.message}</p>}{" "} */}
      {/* render error message if error state is not null */}
    </div>
  );
};

export default WeatherCard;
