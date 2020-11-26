import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

function PostList(props){
	const courseId = props.courseId;
	const [posts, setPosts] = useState([]);
	useEffect(() => {
		fetch(`http://3.138.109.77:5000/posts/${courseId}`)
		.then(res => res.json())
		.then(res => {
			if(res.status === "OK"){
				const posts = res.result.map(post => PostItem(post));
				setPosts(posts);
			}
		});
	}, []);

	return (
		<div className="Post-List">
			{posts}
		</div>
	);
}
function PostItem(post){
	return (
		<div className="Post-Item">
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
