import { useState } from "react"
import axios from "axios"
import "./App.css"
import {
  WiDaySunny, WiRain, WiCloudy, WiSnow,
  WiThunderstorm, WiFog, WiHumidity, WiStrongWind
} from "react-icons/wi"

function getWeatherIcon(description) {
  const d = description.toLowerCase()
  if (d.includes("clear"))       return <WiDaySunny className="main-icon" />
  if (d.includes("rain"))        return <WiRain className="main-icon" />
  if (d.includes("cloud"))       return <WiCloudy className="main-icon" />
  if (d.includes("snow"))        return <WiSnow className="main-icon" />
  if (d.includes("thunder"))     return <WiThunderstorm className="main-icon" />
  if (d.includes("fog") || d.includes("mist")) return <WiFog className="main-icon" />
  return <WiDaySunny className="main-icon" />
}

function App() {
  const [city, setCity]       = useState("")
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  async function fetchWeather() {
    if (!city.trim()) return
    setLoading(true)
    setError("")
    setWeather(null)

    try {
      const res = await axios.get(`http://localhost:8000/weather/${city}`)
      setWeather(res.data)
    } catch (err) {
      setError("City not found. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") fetchWeather()
  }

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">🌤️ Weather App</h1>
        <p className="subtitle">Type a city and get live weather</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input"
          />
          <button onClick={fetchWeather} className="btn">
            Search
          </button>
        </div>

        {loading && <p className="loading">Fetching weather... ⏳</p>}
        {error   && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-box">
            <div className="city-name">
              {weather.city}, {weather.country}
            </div>

            {getWeatherIcon(weather.description)}

            <div className="temp">{Math.round(weather.temperature)}°C</div>
            <div className="description">{weather.description}</div>
            <div className="feels">
              Feels like {Math.round(weather.feels_like)}°C
            </div>

            <div className="details">
              <div className="detail-item">
                <WiHumidity className="detail-icon" />
                <span>{weather.humidity}%</span>
                <small>Humidity</small>
              </div>
              <div className="detail-item">
                <WiStrongWind className="detail-icon" />
                <span>{weather.wind_speed} m/s</span>
                <small>Wind</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App