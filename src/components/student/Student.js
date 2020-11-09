import React from 'react';
import {Route, Switch, useParams, useRouteMatch} from 'react-router-dom';
import NavBar from './NavBar';
import Home from './home/Home';
import Grades from './grades/Grades';
import Courses from './courses/Courses';
import './student.css';
import Schedule from './schedule/Schedule';

function Student(){
    const {id} = useParams();
    const match = useRouteMatch();


    return (
        <div className="StudentPage">
            <NavBar />
            <Switch>
                <Route path={`${match.url}/courses`}>
                    <Courses id={id}/>
                </Route>
                <Route path={`${match.url}/grades`}>
                    <Grades id={id}/>
                </Route>
                <Route exact path={`${match.url}/`}>
                    <Home id={id}/>
                </Route>
                <Route path={`${match.url}/home`}>
                    <Home id={id}/>
                </Route>
                <Route path={`${match.url}/schedule`}>
                    <Schedule id={id}/>
                </Route>
            </Switch>
        </div>
    );

}


export default Student;
