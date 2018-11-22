import React from 'react';
import PropTypes from 'prop-types';

const TempValues = ({highTemp, lowTemp}) => (
	<div className="temps">
		{highTemp}<sup>o</sup> {lowTemp}<sup>o</sup>
	</div>
);

TempValues.propTypes = {
	highTemp: PropTypes.number.isRequired,
	lowTemp: PropTypes.number.isRequired
}

export default TempValues;