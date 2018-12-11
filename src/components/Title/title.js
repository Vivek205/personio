//Libraries and CSS
import React from 'react';
import css from './title.module.css'

const title = props => {
    return (
        <div className={css.title}>
            <i class="fas fa-user"></i>
            <span>{props.text}</span>
        </div>);
}

export default title;