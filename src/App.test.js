import { organizeSchedule } from './student/schedule/TableContainer';
import {validateEmail, validateNameString, validatePhone} from './Utils';

test('convert schedule data', () => {
	const data = [
		{
			classInstanceID: 1,
			courseID: 1,
			course_category: "Math",
			course_name: "Calculus",
			day: 1,
			day_name: "Monday",
			hour: 1
		}
	];
	const result = [
		{
			name: 'Monday',
			hours: [
				{
					"hour": 1,
					"course_category": "Math",
					"course_name": "Calculus",
					"courseID": 1
				}
			],
			day: 1
		}
	];

	const res = organizeSchedule(data);
	expect(res).toStrictEqual(result);
});

describe("testing regexes", () => {
	test("validating an email", () => {
		const data = [
			"name@gmail.com",
			"nam e@gmail.com",
			"nam1e@gmail.com",
			"laksdjfalksdflk",
		];
		expect(validateEmail(data[0])).toBe(true);
		expect(validateEmail(data[1])).toBe(false);
		expect(validateEmail(data[2])).toBe(true);
		expect(validateEmail(data[3])).toBe(false);
	});

	test("validating the name and surname text fields", () => {
		const data = [
			"sdlkfalksdjfkl",
			"l",
			"sdlfjaskdlflaksdjflkasdjfl1kasj",
			"13123",
			"13123 sdkljfasdkf"
		];
		expect(validateNameString(data[0])).toBe(true);
		expect(validateNameString(data[1])).toBe(true);
		expect(validateNameString(data[2])).toBe(false);
		expect(validateNameString(data[3])).toBe(false);
	})

	test("validate a phone number", () => {
		const data = [
			"0902937",
			"akdsljfakdf",
			"+355684297490",
			"0684297490a"
		];
		expect(validatePhone(data[0])).toBe(false);
		expect(validatePhone(data[1])).toBe(false);
		expect(validatePhone(data[2])).toBe(true);
		expect(validatePhone(data[3])).toBe(false);
	});
});
