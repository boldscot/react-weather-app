import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './index.css'; 

function OneDay(name, highTemp, lowTemp, weather) {
	this.name = name;
	this.highTemp = highTemp;
	this.lowTemp = lowTemp;
	this.weather = weather;
}

// Hardcoded fake data
const monday = new OneDay("Mon", 13, 11, "rain");
const tuesday = new OneDay("Tue", 14, 8, "rain");
const wednesday = new OneDay("Wen", 13, 11, "cloudy");
const thursday = new OneDay("Thu", 13, 7, "cloudy");
const friday = new OneDay("Fri", 11, 6, "sunny");
const saturday = new OneDay("Sat", 8, 6, "rain_s_cloudy");
const sunday = new OneDay("Sun", 8, 4, "cloudy");

const aWeek = [
	monday, tuesday, wednesday,
	thursday, friday, saturday, sunday	
]

function TheWeeksWeather({days}) {
	return(
		<div className= "week-weather"> 
			{days.map(day => (
				<Day day={day} key={day.name}/>
			))}
		</div>
	);
}

function Day({day}) {
	return(
		<div className="day">
			<TheDayName name={day.name} />
			<WeatherImage weather={day.weather} />
			<TempValues highTemp={day.highTemp} lowTemp={day.lowTemp} />	
		</div>
	);
}

Day.propTypes = {
	day: PropTypes.object.isRequired
}

const TheDayName = ({name}) => (<div className="name"> {name} </div>)

TheDayName.propTypes = {
	name: PropTypes.string.isRequired
}

const TempValues = ({highTemp, lowTemp}) => (
	<div className="temps">
		{highTemp} {lowTemp}
	</div>
)

TempValues.propTypes = {
	highTemp: PropTypes.number.isRequired,
	lowTemp: PropTypes.number.isRequired
}

function WeatherImage({weather}) {
	let url = require(`../images/${weather}.png`);

	return(
		<img
			src={url}
			className="weather-image"
			alt="image"
		/>		
	);
}

WeatherImage.propTypes = {
	weather: PropTypes.string.isRequired
}

ReactDOM.render(<TheWeeksWeather days={aWeek} />, document.getElementById('root'));
