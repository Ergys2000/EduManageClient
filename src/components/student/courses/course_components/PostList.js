import React, {useEffect, useState} from 'react';
import PostItem from './PostItem';
import './course.css';
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
export default PostList;
