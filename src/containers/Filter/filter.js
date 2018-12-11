//Libraries and CSS
import React from 'react';
import css from './filter.module.css';

const filter = props => {
    return (<div className={css.filter}>
        <input type='text' />
        <div className={css.filterOptions}>
            <input name='filter' type='radio' />
            <label>Hello</label>
        </div>
        <div className={css.filterOptions}>
            <input name='filter' type='radio' />
            <label>Hello</label>
        </div>
        <div className={css.filterOptions}>
            <input name='filter' type='radio' />
            <label>Hello</label>
        </div>

    </div>);
}

export default filter;