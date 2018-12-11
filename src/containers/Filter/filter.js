//Libraries and CSS
import React from 'react';
import css from './filter.module.css';

//components import
import Button from '../../components/Button/button';
import Radio from '../../components/Radio/radio';
const filter = props => {
    return (<div className={css.filter}>
        
        <div className={css.filterOptions}>
            <label>Filter the list of Aplications by </label>
            {props.filter.filterBy.map(option => {
            return (
                <div key={option} className={[css.filterOptions, css.radio].join(' ')}>
                    <Radio filter={props.filter} filterChanged={props.filterChanged} option={option}/>
                </div>)
        })}
            <input className={css.textInput} type='text'
            placeholder='Enter Keyword to filter' 
            value={props.filter.filterText} 
            onChange={props.filterChanged} />
            <Button text='Filter' clicked={props.filterClicked}/>
            <Button text='Clear' clicked={props.filterCleared}/>
        </div>
    </div>);
}

export default filter;