import React from 'react';


export default class TableElement extends React.Component{
	constructor(props){
		super(props);
		this.id = props.id;
		this.state = {
			course: {
				name:null,
				category: null
			}
		};
	}
	componentDidMount(){
		this.getCourse();
	}
	async getCourse(){
		await fetch(`http://localhost:5000/courses/${this.id}`)
			.then(res => res.json())
			.then(course => {
				this.setState({course: course});
			});
	}
	render(){
		return (
			<div className="element">
				<h4>{this.state.course.category}</h4>
				<p>{this.state.course.name}</p>
			</div>
		);
	}
}
