import React from 'react';
import PropTypes from 'prop-types';

const EntityTitle = ({title}) => (<div className="title"> {title} </div>);

EntityTitle.propTypes = {
	title: PropTypes.string.isRequired
}

export default EntityTitle;