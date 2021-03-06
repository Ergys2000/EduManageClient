import React, { useEffect, useState, useContext } from 'react';
import apiLink from "../../API";
import { CourseContext } from "./Course";
import { TeacherContext } from "../Teacher";

function PostList(props) {
	const course = useContext(CourseContext);
	const teacherId = useContext(TeacherContext);

	/* This variable is used to determine when we should update the post list.
	 * Typically this is done after we have added a new post. Everytime this
	 * changes the useEffect hook will rerun.*/
	const [shouldUpdate, setShouldUpdate] = useState(0);

	const [posts, setPosts] = useState([]);
	useEffect(() => {
		const fetchPosts = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = 'Bearer ' + token;

			await fetch(`${apiLink}/teachers/${teacherId}/courses/${course.id}/posts`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => {
					if (res.status === "OK") {
						const posts = res.result.map(post => <PostItem key={post.id} post={post} />);
						setPosts(posts);
					} else {
						alert(res.message);
					}
				});
		}
		fetchPosts();
	}, [shouldUpdate, course.id, teacherId]);

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
	const teacherId = useContext(TeacherContext);
	const course = useContext(CourseContext);

	const [shown, setShown] = useState(false);

	const [post, setPost] = useState({
		title: "",
		body: ""
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

		await fetch(`${apiLink}/teachers/${teacherId}/courses/${course.id}/posts`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': bearer
			},
			body: JSON.stringify(req_body)
		})
			.then(res => res.json())
			.then(res => {
				if (res.status === "OK") {
					alert("Post added successfully!");
					updatePostList();
					setShown(false);
				} else {
					alert(res.message);
				}
			}).catch(err => console.log(err));
	}

	const cancel = (event) => {
		event.preventDefault();
		setShown(false);
	}
	return (
		<div className="post-form">
			<button onClick={() => setShown(true)} className={shown ? "hidden" : "shown"} >Post</button>
			<form onSubmit={onSubmit} className={shown ? "shown" : "hidden"}>
				<label>
					Title<br/>
					<input type="text" onChange={handleChange} name="title" placeholder="Post title" value={post.title} />
				</label>
				<label>
					Body<br/>
					<textarea onChange={handleChange} name="body" rows="10" cols="30" placeholder="Post body" value={post.body} />
				</label>
				<button type="submit">Add post</button>
				<button onClick={cancel}>Cancel</button>
			</form>
		</div>
	);

}

export default PostList;
