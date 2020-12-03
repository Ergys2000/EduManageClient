import React from 'react';

function FileForm({classInstanceId, courseId}){
	return (
		<div className="File-Form">
			<form
				method="post"
				action={`http://localhost:5000/files/${classInstanceId}/${courseId}`}
				encType="multipart/form-data">

				<input type="file" name="file" />
				<input type="submit" value="Upload" />
			</form>
		</div>
	);
}

export default FileForm;
