import React from "react";

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            student: null,
        };
    }
    componentDidMount(){
        this.getStudent();
    }
    async getStudent(){
        await fetch(`http://localhost:5000/students/${this.props.id}`)
            .then(res => res.json())
            .then(student => this.setState({student: student}));
    }
    render(){
        return (
            <div className="option">
                <h1>Welcome {(this.state.student) ? this.state.student.firstname : "..."}</h1>
            </div>
        );
    }
}

export default Home;
