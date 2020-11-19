import React from 'react';

function FileForm({classInstanceID, courseID}){
	return (
		<div className="File-Form">
			<form method="post" action={`http://localhost:5000/files/${classInstanceID}/${courseID}`} encType="multipart/form-data">
				<input type="file" name="file"/>
				<input type="submit" />
			</form>
		</div>
	);
}

export default FileForm;
