//Libraries and CSS
import React from 'react';

//Components import
import Title from '../Title/title';
import Filter from '../../containers/Filter/filter';

const header = props =>{
    return(
        <div>
        <Title text='Applications' />
        <Filter />
        </div>
    );
}

export default header;