//Libraries and CSS
import React from 'react';
import css from './radio.module.css';

const radio = props => {
    return (
        <div className={css.radio}>
            <input type='radio' name='filter'
                checked={props.filter.filterSelected == props.option ? true : false}
                value={props.option}
                onChange={props.filterChanged} />
            <label className={props.filter.filterSelected == props.option ? css.activeLabel : ''}>
                {props.option}
            </label>
        </div>)
}

export default radio;