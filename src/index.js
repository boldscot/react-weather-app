import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import './index.css'; 

function OneDay(name, highTemp, lowTemp, weather) {
	this.name = name;
	this.highTemp = highTemp;
	this.lowTemp = lowTemp;
	this.weather = weather;
}

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			nextFiveDays: []
		};
	}

	componentDidMount() {
	  axios.get('https://api.openweathermap.org/data/2.5/forecast?id=2960991&APPID=cb6f52333c98f1ed947e3bb5de394074&units=metric')
	  	.then(res => {
	  		//console.log(res);
      		const data = res.data.list.map(obj => obj);
      		this.setState({
      			data: data
      		});

      		this.getFiveDayForecast(this.state.data);
    	});
	} 

	getFiveDayForecast(data) {
		if (data.length === 0) return;

		let currentDate = data[0].dt_txt.substring(8, 10);
		let days = [];

		days.push(data[0]);

		for (let i = 1; i < data.length; ++i) {
			// use 1st entry of a day for the daily weather
			if(data[i].dt_txt.substring(8, 10) !== currentDate.toString()) {
				days.push(data[i]);
				++currentDate;
			}
		}
		console.log(days);

		this.createDayObjects(days);
	}

	createDayObjects(days) {
		let nextFiveDays = [];

		for (let i = 0; i < days.length; i++) {
			let dayName = new Date(days[i].dt_txt).toLocaleDateString("ire", {weekday: 'short'});
			let weatherIcon = days[i].weather[0].icon;
			let highTemp = Math.round(days[i].main.temp_max);
			let lowTemp = Math.round(days[i].main.temp_min);

			nextFiveDays[i] = new OneDay(dayName, highTemp, lowTemp, weatherIcon);
		}

		this.setState({
			nextFiveDays: nextFiveDays
		});
	}

	render() {
		return (
      		<div> 
      			{this.state.nextFiveDays.map(day => (
      				<Day day={day} key={day.name}/>
      		 	))}
      		 </div>
    	);
  	}
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
		{highTemp}<sup>o</sup> {lowTemp}<sup>o</sup>
	</div>
)

TempValues.propTypes = {
	highTemp: PropTypes.number.isRequired,
	lowTemp: PropTypes.number.isRequired
}

function WeatherImage({weather}) {
	let url = `http://openweathermap.org/img/w/${weather}.png`;

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

ReactDOM.render(<App />, document.getElementById('root'));
