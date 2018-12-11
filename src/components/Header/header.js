//Libraries and CSS
import React from 'react';

//Components import
import Title from '../Title/title';
import Filter from '../../containers/Filter/filter';

const header = props => {
    return (
        <>
            <Title text='Applications' />
            <Filter
                filter={props.filter}
                filterChanged={props.filterChanged}
                filterClicked={props.filterClicked}
                filterCleared={props.filterCleared}
            />
        </>
    );
}

export default header;