//Libraries and CSS
import React from 'react';
import css from './loader.module.css';

const loader = props => {
    return (
        <div className={css.container}>
            <div className={[css.dash, css.uno].join(' ')}></div>
            <div className={[css.dash, css.dos].join(' ')}></div>
            <div className={[css.dash, css.tres].join(' ')}></div>
            <div className={[css.dash, css.cuatro].join(' ')}></div>
        </div>
    );
}

export default loader;