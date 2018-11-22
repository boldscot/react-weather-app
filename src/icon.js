import React from 'react';
import PropTypes from 'prop-types';

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

export default WeatherIcon;