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
                        {this.props.headings.map(value => <th scope="col" key={value}>{value}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {this.props.appData.map(value => {
                      return  <tr key={value.id}>
                            {this.props.headings.map(heading=>
                               <td key={value.id+heading} data-label={heading}>{value[heading]}</td> )}
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