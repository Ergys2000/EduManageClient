import React, {useEffect, useState, useContext} from 'react';
import apiLink from "../../API";
import {CourseContext} from './Course';
import {StudentContext} from '../Student';

function PostList(props){
	const course = useContext(CourseContext);
	const studentId = useContext(StudentContext);
	const [posts, setPosts] = useState([]);

	useEffect(() => {

		const fetchPosts = async () => {

			const token = sessionStorage.getItem("jwt");
			const bearer = 'Bearer ' + token;
			await fetch(`${apiLink}/students/${studentId}/courses/${course.id}/posts`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => {
					if (res.status === "OK") {
						const posts = res.result.map(post => PostItem(post));
						setPosts(posts);
					}
				});
		}

		fetchPosts();

	}, []);

	return (
		<div className="post-list">
			{posts}
		</div>
	);
}

function PostItem(post){
	return (
		<div className="post-item">
			<div className="header">
				<p><b>{post.author}</b></p>
				<p>{post.posted_on}</p>
			</div>
			<div className="body">
					<p>{post.body}</p>
			</div>
		</div>
	);
}
export default PostList;
