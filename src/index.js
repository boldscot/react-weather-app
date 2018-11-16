import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import './index.css'; 

function WeatherEntity(title, highTemp, lowTemp, icon) {
	this.title = title;
	this.highTemp = highTemp;
	this.lowTemp = lowTemp;
	this.icon = icon;
}

function findHighestNumber(array) {
	let highest = 0;

	for (let i = 0; i < array.length; i++) {
		if (array[i] > highest) {
			highest = array[i];
		}
	}
	return highest;
}

function findLowestNumber(array) {
	let lowest = 9999999;

	for (let i = 0; i < array.length; i++) {
		if (array[i] < lowest) {
			lowest = array[i];
			}
	}
	return lowest;
}

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			nextFiveDays: [],
			selectedDay: new Date().toLocaleDateString("ire",{weekday: 'short'}),
			selectedDayWeather: []
		};
	}

	componentDidMount() {
	  axios.get('https://api.openweathermap.org/data/2.5/forecast?id=2960991&APPID=cb6f52333c98f1ed947e3bb5de394074&units=metric')
	  	.then(res => {
	  		console.log(res);
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
		let day = [];

		day.push(data[0]);

		for (let i = 1; i < data.length; ++i) {
			if (data[i].dt_txt.substring(8, 10) === currentDate.toString()) {
				day.push(data[i]);

				if(i === data.length-1) {
					days.push(day);
				}	
			} else {
				//add day to days array
				days.push(day);
				// clear day array
				day = [];
				++currentDate;
			}
		}

		this.createWeatherEntries(days);
		console.log(days);
	}

	createWeatherEntries(data) {
		let nextFiveDays = [];

		for (let i = 0; i < data.length; i++) {
			let title = new Date(data[i][0].dt_txt).toLocaleDateString("ire",{weekday: 'short'});
			let weatherIcon = data[i][0].weather[0].icon;

			let numbers = [];
			for (let j = 0; j < data[i].length; j++) {
				numbers.push(data[i][j].main.temp_max);
			}

			let highTemp = Math.round(findHighestNumber(numbers));

			// clear the number array
			numbers =[];
			for (let j = 0; j < data[i].length; j++) {
				numbers.push(data[i][j].main.temp_min);
			}

			let lowTemp = Math.round(findLowestNumber(numbers));

			nextFiveDays[i] = new WeatherEntity(title, highTemp, lowTemp, weatherIcon);

			if(title === this.state.selectedDay) {
				let hourlyWeather = [];

				for (let j = 0; j < data[i].length; j++) {
					let title = data[i][j].dt_txt.substring(11, 16);
					let weatherIcon = data[i][j].weather[0].icon;
					let highTemp = data[i][j].main.temp_max;
					let lowTemp= data[i][j].main.temp_min;

					hourlyWeather.push(new WeatherEntity(title, highTemp, lowTemp, weatherIcon));
				}

				this.setState({
					selectedDayWeather: hourlyWeather
				});
			}
		}

		this.setState({
			nextFiveDays: nextFiveDays
		});
	}

	render() {
		return (
      		<div> 
      			{this.state.nextFiveDays.map(ent => (
      				<Entity entity={ent} key={ent.title}/>
      		 	))}
      		 	<div>
	      		 	{this.state.selectedDayWeather.map(ent => (
	      				<Entity entity={ent} key={ent.title}/>
	      		 	))}
	      		 </div>
      		 </div>
    	);
  	}
}

function Entity({entity}) {
	let today = new Date();
	let todayName = today.toLocaleDateString("ire", {weekday: 'short'});
	let cName = (entity.title === todayName ? "today" : "day");

	return(
		<div className={cName}>
			<EntityTitle title={entity.title} />
			<WeatherIcon icon={entity.icon} />
			<TempValues highTemp={entity.highTemp} lowTemp={entity.lowTemp} />	
		</div>
	);
}

Entity.propTypes = {
	entity: PropTypes.object.isRequired
}

const EntityTitle = ({title}) => (<div className="title"> {title} </div>);

EntityTitle.propTypes = {
	title: PropTypes.string.isRequired
}

const TempValues = ({highTemp, lowTemp}) => (
	<div className="temps">
		{highTemp}<sup>o</sup> {lowTemp}<sup>o</sup>
	</div>
);

TempValues.propTypes = {
	highTemp: PropTypes.number.isRequired,
	lowTemp: PropTypes.number.isRequired
}

function WeatherIcon({icon}) {
	let url = `http://openweathermap.org/img/w/${icon}.png`;

	return(
		<img
			src={url}
			className="weather-icon"
			alt="weather-icon"
		/>		
	);
}

WeatherIcon.propTypes = {
	icon: PropTypes.string.isRequired
}

ReactDOM.render(<App />, document.getElementById('root'));
