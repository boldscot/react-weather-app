import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import './index.css'; 

function WeatherEntity(title, time, highTemp, lowTemp, icon) {
	this.title = title;
	this.time = time;
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
			selectedDay: new Date().toLocaleDateString("ire",{weekday: 'short'})
		};
	}

	componentDidMount() {
	  axios.get('https://api.openweathermap.org/data/2.5/forecast?id=2960991&APPID=cb6f52333c98f1ed947e3bb5de394074&units=metric')
	  	.then(res => {
      		const data = res.data.list.map(obj => obj);

      		this.setState({
      			data: this.createWeatherObjects(data)
      		});
    	});
	}

	
    createWeatherObjects(data) {
    	let daysWeather = [];
      	let weeksWeather = [];
      	let currentDay = new Date().toLocaleDateString("ire",{weekday: 'short'});

	  	if (data.length > 0) {
			for (let i = 0; i < data.length; i++) {
				let title = new Date(data[i].dt_txt).toLocaleDateString("ire",{weekday: 'short'});
				let time = data[i].dt_txt.substring(11);
				let weatherIcon = data[i].weather[0].icon; 
				let highTemp = data[i].main.temp_max;
				let lowTemp = data[i].main.temp_min;

				let entity = new WeatherEntity(title, time, highTemp, lowTemp, weatherIcon);

				if (currentDay === title) {
					daysWeather.push(entity);
				} else {
					weeksWeather.push(daysWeather);
					daysWeather = [];
					daysWeather.push(entity);
					currentDay = title;
				}
			}
	  	}
	  	return weeksWeather;
    } 

	handleClick(entityTitle) {
		this.setState({
			selectedDay: entityTitle
		});
	}

	render() {
		let days = [];
		let selectedDayWeather = [];
		const data = this.state.data;

		console.log(data);

		for (let i = 0; i < data.length; i++) {
			let hours = data[i];

			if (hours[i].title === this.state.selectedDay) {
				for (let x = 1; x < hours.length; x++) {
					let o = hours[x];
					let ent = new WeatherEntity(o.title, o.time, o.highTemp, o.lowTemp, o.icon);

					ent.title = ent.time.substring(0, 5);
					ent.highTemp = Math.round(ent.highTemp);
					ent.lowTemp = Math.round(ent.lowTemp);

					selectedDayWeather.push(ent);
				}
			}

			let numbers = [];
			for (let j = 0; j < hours.length; j++) {
				numbers.push(hours[j].highTemp);
				numbers.push(hours[j].lowTemp);
			}

			let ent = data[i][0];

			ent.highTemp = Math.round(findHighestNumber(numbers));
			ent.lowTemp = Math.round(findLowestNumber(numbers));

			days.push(ent);
		}

		return (
			<React.Fragment>
				<div className="days">
		      		{days.map(ent => ( 
		      			<Entity 
		      				entity={ent} 
		      				isDay={true} 
		      				selectedDay={this.state.selectedDay}
		      				onClick={i => this.handleClick(ent.title)} 
		      				key={ent.title}
		      			/>
		      		 ))}
		      	</div>
		       	<div className="dummy-div"> </div>
		      	<div className="hours">
		      		{selectedDayWeather.map(ent => (
			      		<Entity entity={ent} isDay={false} key={ent.title}/>
			      	))}
		      	</div>
	      	</React.Fragment>
    	);
  	}
}

function Entity({entity, isDay, selectedDay, onClick}) {
	let cName = "entity";

	if (isDay) {
		if (entity.title === selectedDay) {
			cName = "selectedDay";
		}
	}

	return(
		<div className={cName} onClick={onClick}>
			<EntityTitle title={entity.title} />
			<WeatherIcon icon={entity.icon} />
			<TempValues highTemp={entity.highTemp} lowTemp={entity.lowTemp} />	
		</div>
	);
}

Entity.propTypes = {
	entity: PropTypes.object.isRequired,
	isDay: PropTypes.bool.isRequired
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
