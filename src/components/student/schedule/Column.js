import React from 'react';
import TableElement from './TableElement';


export default class Column extends React.Component{
	constructor(props){
		super(props);
		this.title = props.title;
		this.id = props.id;
		this.state = {
			hours: null
		};
	}
	componentDidMount(){
		this.getDay();
	}
	getDay(){
		fetch(`http://localhost:5000/day/${this.id}`)
			.then(res => res.json())
			.then(day => {
				const hours = [
					<TableElement id={day.one}/>,
					<TableElement id={day.two}/>,
					<TableElement id={day.three}/>,
					<TableElement id={day.four}/>,
					<TableElement id={day.five}/>,
					<TableElement id={day.six}/>,
					<TableElement id={day.seven}/>,
					<TableElement id={day.eight}/>,
					<TableElement id={day.nine}/>,
					<TableElement id={day.ten}/>,
					<TableElement id={day.eleven}/>,
					<TableElement id={day.twelve}/>,
				];
				this.setState({hours: hours});
			});
	}
	render(){
		return (
			<div className="column">
				<h2>{this.title}</h2>
				{this.state.hours}
			</div>
		);
	}
}
