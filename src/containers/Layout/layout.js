//Libraries and CSS
import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
//Components import
import Header from '../../components/Header/header';
import ApplicationTable from '../ApplicationTable/applicationTable';
import Loader from '../../components/Loader/loader';
import Alert from '../../components/Alert/alert';

class Layout extends Component {
    state = {
        loader: false,
        alert: { show: false, msg: '', type: '' }
    }
    componentDidMount = () => {
        this.fetchAppData();
    }

    //contacting server for details of all the applications
    fetchAppData = () => {
        this.setState({ loader: true });
        axios.get('http://personio-fe-test.herokuapp.com/api/v1/candidates')
            .then(response => {
                if (response.data.data) {
                    let headings = []
                    for (let i in response.data.data[0]) {
                        headings.push(i);
                    }
                    this.props.updateAppData(response.data.data);
                    this.props.updateHeadings(headings);
                    
                } else {
                    this.setState({
                        alert: {
                            show: true,
                            msg: `Network Error ${response.data.error.code}:Please reload`,
                            type: 'Error'
                        }
                    })
                }
                this.setState({ loader: false });

            })
            .catch(err => {
                console.log('error', err)
                this.setState({
                    loader: false,
                    alert: {
                        show: true,
                        msg: `Network Error: Cannot reach the server. Please reload`,
                        type: 'Error'
                    }
                })
            })
    }

    //cloasing the alert modal
    closeAlert = () => {
        this.setState({ alert: { show: false, msg: '', type: '' } })
    }

    render() {
        return (<div>
            {this.state.loader ?
                <Loader /> :
                <>
                    <Alert
                        show={this.state.alert.show}
                        type={this.state.alert.type}
                        msg={this.state.alert.msg}
                        clicked={this.closeAlert} />
                    <Header />
                    <ApplicationTable />
                </>}
        </div>)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateAppData: (payload) => dispatch({ type: 'updateAppData', payload: payload }),
        updateHeadings: (headings) => dispatch({ type: 'updateHeadings', headings: headings })
    };
}

export default connect(null, mapDispatchToProps)(Layout);