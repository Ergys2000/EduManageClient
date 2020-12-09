import React, {useEffect, useState} from 'react';
import apiLink from "../../API";

function PostList(props){
	const courseId = props.courseId;
	const [posts, setPosts] = useState([]);
	useEffect(() => {
		const fetchPosts = async () => {
			await fetch(`${apiLink}/posts/${courseId}`)
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
