function Home(props) {
	const courseId = props.courseId;
	return (
		<div className="home">
			<h2>Syllabus, course id: {courseId}</h2>
		</div>
	);
}

export default Home;
