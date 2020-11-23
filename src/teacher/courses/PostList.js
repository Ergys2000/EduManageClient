import React, {useEffect, useState} from 'react';

function PostList(props){
	const [posts, setPosts] = useState([]);
	useEffect(() => {
		if(props.courseID !== -1){
			fetch(`http://localhost:5000/posts/${props.courseID}`)
			.then(res => res.json())
			.then(postList => setPosts(postList));
		}
	}, []);

	return (
		<div className="Post-List">
			{posts.map(post => PostItem(post))}
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
