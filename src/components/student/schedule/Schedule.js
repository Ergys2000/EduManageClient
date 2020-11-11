import React from 'react';
import './schedule.css';
import TableContainer from './TableContainer';
class Schedule extends React.Component{
	constructor(props){
		super(props);
		this.id = props.id;
	}
	render(){
		return(
			<div className="option"> 
				<TableContainer id={this.id}/>
			</div>
		);
	}
}

export default Schedule;
