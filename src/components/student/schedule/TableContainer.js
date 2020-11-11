import React from 'react';
import Timeline from './Timeline';
import Column from './Column';


export default class TableContainer extends React.Component{
	constructor(props){
		super(props);
		this.id = props.id;
		this.state = {
			columns: null
		};
	}
	componentDidMount(){
		this.getSchedule();
	}
	async getSchedule(){
		await fetch(`http://localhost:5000/students/${this.id}/schedule`)
			.then(res => res.json())
			.then(schedule => {
				const columns = [
					<Column title="Monday" id={schedule.monday}/>,
					<Column title="Tuesday" id={schedule.tuesday}/>,
					<Column title="Wednesday" id={schedule.wednesday}/>,
					<Column title="Thursday" id={schedule.thursday}/>,
					<Column title="Friday" id={schedule.friday}/>
				];
				this.setState({columns: columns});
			});
	}
	render(){
		return (
			<div className="table-container">
				<Timeline />
				{this.state.columns}
			</div>
		);
	}
}
