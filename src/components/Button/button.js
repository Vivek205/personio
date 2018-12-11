// Libraries and css
import React from 'react';
import css from './button.module.css';

const button = props => {
    return (
        <button 
        className={[css.btn, css.btn1, css.btn1a].join(' ')}
        onClick={props.clicked}><i className={props.iconName}></i></button>
    );
}

export default button;