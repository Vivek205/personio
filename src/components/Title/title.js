//Libraries and CSS
import React from 'react';
import css from './title.module.css'

const title =props=>{
    return(<>
    <div className={css.icon}></div><span>{props.text}</span>
    </>);
}

export default title;