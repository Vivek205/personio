//Libraries and CSS
import React, { Component } from 'react';
import css from './applicationTable.module.css';
import { connect } from 'react-redux';
//Components import

class ApplicationTable extends Component {
    render() {
        return (<div className={css.ht}>
            <table>
                <thead>
                    <tr>
                        {this.props.headings.map(value => <th scope="col"
                        data-label={
                            this.props.sortBy == value?
                            this.props.sortOrder == 'AZ'?'sortedAZ':'sortedZA':''
                        }
                            className={['year_of_experience','position_applied','application_date'].includes(value)?css.sortable:''}
                            key={value}
                            onClick={this.props.clicked}
                            id={value}>{value}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {this.props.appData.map(value => {
                        return <tr key={value.id}>
                            {this.props.headings.map(heading =>
                                <td key={value.id + heading} data-label={heading}>{value[heading]}</td>)}
                        </tr>
                    })}
                </tbody>
            </table>
        </div>);
    }
}

const mapStateToProps = state => {
    return {
        headings: state.headings,
        appData: state.appData
    }

}

export default connect(mapStateToProps)(ApplicationTable);