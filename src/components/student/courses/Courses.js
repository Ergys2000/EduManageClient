import React from 'react';
import './courses.css';

class Courses extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			courses: null
		};
	}
	componentDidMount(){
		this.getCourses();
	}
	async getCourses(){
		await fetch(`http://localhost:5000/students/${this.props.id}/courses`)
			.then(res => res.json())
			.then(courses => {
				console.log(courses);
				const courseList = courses.map(x => CourseItem(x));
				this.setState({courses: courseList});
			});
	}
	render(){
		return (
			<div className="option">
				<h1>Courses</h1>
				<table> 
					<tr>
						<th>Course name</th>
						<th>Course category</th>
					</tr>

					{this.state.courses}

				</table>
			</div>
		);
	}
}
function CourseItem(course){
	return (
		<tr>
			<td>{course.name}</td>
			<td>{course.category}</td>
		</tr>
	);
}


export default Courses;
