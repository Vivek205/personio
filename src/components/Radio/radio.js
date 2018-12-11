//Libraries and CSS
import React from 'react';
import css from './radio.module.css';

const radio = props => {
    return (
    <>
        <input type='radio' name='filter'
            checked={props.filter.filterSelected == props.option ? true : false}
            value={props.option}
            onChange={props.filterChanged} />
        <label>{props.option}</label>
    </>)
}

export default radio;