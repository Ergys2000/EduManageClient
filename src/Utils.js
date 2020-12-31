const validateEmail = (string) => {
	const regex = /^\S+@\S+\.\S+$/;
	return regex.test(string);
}
const validateNameString = (string) => {
	const regex = /^[a-zA-z]{0,30}$/;
	return regex.test(string);
}
const validatePhone = (string) => {
	const regex = /^\+?\d{10,14}$/;
	return regex.test(string);
}

/*
 * this function that organizes the schedule into day specific
 * hours, so  that they are easier to display
*/
const organizeSchedule = (schedule_data) => {
	let result = []; // the final result
	// dayIndex tells us on which day we are inserting
	// hourIndex tells us on which hour we are inserting
	let currDayIndex = -1, currHourIndex = 0;

	// lastDayName represents the name of the last day we were adding into
	// we use it to determine when we need to insert hours into another day
	let lastDayName = "";

	for (let i = 0; i < schedule_data.length; i++) {

		let row = schedule_data[i];

		// if the day name has changed
		if (lastDayName !== row.day_name) {
			// modify and increment the variables
			lastDayName = row.day_name;
			currDayIndex++;
			currHourIndex = 0;
			// initialize the day object in the correct index
			result[currDayIndex] = { name: lastDayName, hours: [], day: row.day };
		}

		result[currDayIndex].hours[currHourIndex] = {
			id: row.id,
			hour: row.hour,
			course_name: row.course_name,
			course_category: row.course_category,
			courseID: row.courseID
		};

		currHourIndex++;
	}
	return result;
}

/* this function organizes grades that come from the api into student specific
 * grades so that they are easier to display */
const organizeGrades = (grades) => {

	// the final result
	let result = [];
	// helps us determine if the grades have changed
	let lastStudentId = -1;
	// holds the current position in terms of student count
	let currPosition = -1;

	// for each grade in the list
	for (let i = 0; i < grades.length; i++) {
		// extract the current grade
		const currGrade = grades[i];
		// get only the neccessary information
		const grade = {
			id: currGrade.id,
			grade: currGrade.grade,
			weight: currGrade.weight,
			date: currGrade.date
		};
		// if the student id has not changed
		if (lastStudentId !== currGrade.studentID) {
			// increment the counter to point to the other student
			currPosition++;
			lastStudentId = currGrade.studentID;
			// create the other student entry
			result[currPosition] = {
				id: currGrade.studentID,
				firstname: currGrade.firstname,
				lastname: currGrade.lastname,
				grades: []
			}
		}
		result[currPosition].grades.push(grade);
	}
	return result;

}

/* organizes the list of files received from the api 
 * into a list of student objects, each containing a list of files
 * */
const organizeStudents = (studentFiles) => {
	const result = [];/* The final result */
	/* Keeps track of the current student id */
	let lastStudentId = -1;
	/* Keeps track of the current student index */
	let currStudent = -1;
	for (let i = 0; i < studentFiles.length; i++) {
		const studentFile = studentFiles[i];

		/* If the file belongs to a new student this means that
		 * we now have to create a new student object*/
		if (studentFile.studentID !== lastStudentId) {
			lastStudentId = studentFile.studentID;
			currStudent++;
			result[currStudent] = {
				id: studentFile.studentID,
				firstname: studentFile.firstname,
				lastname: studentFile.lastname,
				files: []
			}
		}

		result[currStudent].files.push(studentFile);
	}
	return result;
}

export {
	validateEmail, 
	validateNameString, 
	validatePhone,
	organizeSchedule,
	organizeGrades,
	organizeStudents
};
