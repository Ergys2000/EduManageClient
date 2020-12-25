import React, { useEffect, useState, useContext } from 'react';
import apiLink from "../../API";
import { CourseContext } from './Course';
import { StudentContext } from '../Student';

function PostList(props) {
	const course = useContext(CourseContext);
	const studentId = useContext(StudentContext);
	const [posts, setPosts] = useState([]);

	/* This variable is used to determine when we should update the post list.
	 * Typically this is done after we have added a new post. Everytime this
	 * changes the useEffect hook will rerun.*/
	const [shouldUpdate, setShouldUpdate] = useState(0);

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
						const posts = res.result.map(post => <PostItem key={post.id} post={post} />);
						setPosts(posts);
					}
				});
		}

		fetchPosts();
	}, [shouldUpdate]);

	return (
		<div className="post-list">
			<PostForm updateCallback={() => setShouldUpdate(shouldUpdate + 1)} />
			{posts}
		</div>
	);
}

function PostItem({ post }) {
	return (
		<div className="post-item">
			<div className="header">
				<p><b>{post.author}</b></p>
				<p>{post.posted_on}</p>
			</div>
			<div className="body">
				<p><b>{post.title}</b></p>
				<p>{post.body}</p>
			</div>
		</div>
	);
}

function PostForm(props) {
	const updatePostList = props.updateCallback;
	const studentId = useContext(StudentContext);
	const course = useContext(CourseContext);

	const [post, setPost] = useState({
		title: "Post title",
		body: "Post body"
	});

	const handleChange = (event) => {
		event.preventDefault();
		const target = event.target;
		const name = target.name;
		const value = target.value;
		if (name === "title") {
			if (value.length > 100) {
				alert("The title is too long");
				return;
			}
		}
		setPost({ ...post, [name]: value });
	}

	const onSubmit = async (event) => {
		event.preventDefault();
		const token = sessionStorage.getItem("jwt");
		const bearer = "Bearer " + token;

		const req_body = {
			title: post.title,
			body: post.body
		};

		await fetch(`${apiLink}/students/${studentId}/courses/${course.id}/posts`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': bearer
			},
			body: JSON.stringify(req_body)
		})
			.then(res => res.json())
			.then(res => res.status === "OK" ? res.result : null)
			.then(result => {
				alert("Post added successfully!");
				updatePostList();
			}).catch(err => console.log(err));
	}
	return (
		<form onSubmit={onSubmit}>
			<input type="text" onChange={handleChange} name="title" placeholder="Post title" value={post.title} />
			<br />
			<textarea onChange={handleChange} name="body" rows="10" cols="30" value={post.body} />
			<br />
			<input type="submit" />
		</form>
	);

}
export default PostList;
