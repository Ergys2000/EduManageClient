import React, {useEffect, useState} from 'react';

function PostList(props){
	const [posts, setPosts] = useState([]);
	useEffect(() => {
		fetch(`http://localhost:5000/posts/${props.courseId}`)
		.then(res => res.json())
		.then(postList => {
			console.log(postList);
			const posts = postList.map(post => PostItem(post));
			setPosts(posts);
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
