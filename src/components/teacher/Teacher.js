import React from 'react';
import {Route, Switch, useParams, useRouteMatch} from 'react-router-dom';
import NavBar from './NavBar';

function Teacher(){
    let {id} = useParams();
    let match = useRouteMatch();
    return (
        <div className="TeacherPage">
            <NavBar />
            <Switch>
                <Route path={`${match.url}/home`}>
                    <Home id={id}/>
                </Route>
                <Route path={`${match.url}/students`}>
                    <Students id={id}/>
                </Route>
                <Route path={`${match.url}/courses`}>
                    <Courses id={id}/>
                </Route>
            </Switch>
        </div>
    );

}

function Home(props){
    return (
        <h1>Home</h1>
    );
}

function Students(props){
    return (
        <h1>Students</h1>
    );
}

function Courses(props){
    return (
        <h1>Courses</h1>
    );
}
export default Teacher;
