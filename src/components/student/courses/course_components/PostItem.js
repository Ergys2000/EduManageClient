import React from 'react';

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

export default PostItem;
