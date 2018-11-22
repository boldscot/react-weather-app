import React from 'react';
import PropTypes from 'prop-types';
import EntityTitle from './title.js';
import WeatherIcon from './icon.js';
import TempValues from './temperature.js';

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

export default Entity;