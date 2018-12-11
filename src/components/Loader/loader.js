//Libraries and CSS
import React from 'react';
import css from './loader.module.css';

const loader = props => {
    return (
        <div className={css.loader}>Loading...</div>
    );
}

export default loader;