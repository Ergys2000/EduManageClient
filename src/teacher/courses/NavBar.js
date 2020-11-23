import React from 'react';
import {Link, useRouteMatch} from 'react-router-dom';

function NavBar(props){
	const {path, url} = useRouteMatch();
	return (
		<div className="NavBar">
		</div>
	);
}

export default NavBar;
