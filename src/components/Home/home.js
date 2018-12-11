import React from 'react';
import { Link } from 'react-router-dom';
import css from './home.module.css';

const home = props => {
    return (
        <div className={css.home}>
            <h1>Application Management Tool</h1>
            <Link to='/applications/'><h4>click to view the applications</h4></Link>
        </div>);
}

export default home;