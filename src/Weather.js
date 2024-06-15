import React, { useState } from 'react';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = 'e3c9ea2215879abe04f6a2a6810e0e27';

  const fetchWeather = async () => {
    setLoading(true);
    setError('');
    try {
      const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
      const weatherData = await weatherResponse.json();
      if (weatherResponse.ok) {
        setWeather(weatherData);
      } else {
        if (weatherData.cod === 401) {
          throw new Error('Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.');
        } else {
          throw new Error(weatherData.message);
        }
      }

      const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
      const forecastData = await forecastResponse.json();
      if (forecastResponse.ok) {
        setForecast(forecastData);
      } else {
        if (forecastData.cod === 401) {
          throw new Error('Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.');
        } else {
          throw new Error(forecastData.message);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = (description) => {
    if (description.includes('rain')) {
      return <i className="fas fa-cloud-showers-heavy"></i>;
    } else if (description.includes('cloud')) {
      return <i className="fas fa-cloud"></i>;
    } else if (description.includes('sun') || description.includes('clear')) {
      return <i className="fas fa-sun"></i>;
    } else {
      return <i className="fas fa-smog"></i>;
    }
  };

  const renderForecast = () => {
    if (!forecast) return null;

    const dailyForecasts = forecast.list.filter((item, index) => index % 8 === 0);

    return (
      <div>
        <h3>5-Day Forecast</h3>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {dailyForecasts.map((item, index) => (
            <div key={index} style={{ padding: '10px', textAlign: 'center' }}>
              <h4>{new Date(item.dt_txt).toLocaleDateString()}</h4>
              {renderIcon(item.weather[0].description)}
              <p>{item.weather[0].description}</p>
              <p>{Math.round(item.main.temp - 273.15)}°C</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>Weather App</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />
      <button onClick={fetchWeather}>Get Weather</button>
      {loading && <p>Loading...</p>}
      {error && (
        <p style={{ color: 'red' }}>
          {error.includes('Invalid API key') ? (
            <span>
              Invalid API key. Please see <a href="https://openweathermap.org/faq#error401" target="_blank" rel="noopener noreferrer">https://openweathermap.org/faq#error401</a> for more info.
            </span>
          ) : (
            error
          )}
        </p>
      )}
      {weather && (
        <div>
          <h2>{weather.name}</h2>
          {renderIcon(weather.weather[0].description)}
          <p>{weather.weather[0].description}</p>
          <p>{Math.round(weather.main.temp - 273.15)}°C</p>
        </div>
      )}
      {renderForecast()}
    </div>
  );
};

export default Weather;
