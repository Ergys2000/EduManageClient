import {useContext} from 'react';
import {CourseContext} from "./Course";

function Home(props) {
	const course = useContext(CourseContext);
	return (
		<div className="home">
			<h2>Syllabus, course id: {course.id}</h2>
		</div>
	);
}

export default Home;
