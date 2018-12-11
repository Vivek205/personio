//Libraries and CSS
import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import css from './layout.module.css';
//Components import
import Header from '../../components/Header/header';
import ApplicationTable from '../ApplicationTable/applicationTable';
import Loader from '../../components/Loader/loader';
import Alert from '../../components/Alert/alert';

class Layout extends Component {
    state = {
        loader: false,
        alert: { show: false, msg: '', type: '' },
        filter: {
            filterBy: ['name', 'status', 'position_applied'],
            filterText: '',
            filterSelected: ''
        },
        sort: {
            sortBy: '',
            order: ''
        }
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
                    this.props.updateMasterData(response.data.data);
                    this.props.updateAppData(response.data.data);
                    this.props.updateHeadings(headings);

                    //checking for the filter and sort in query parameters
                    let query = this.fetchQueryParams();

                    //if query contains filter details
                    if ('filter' in query) {
                        let filterSelected = query.filter.substring(0, query.filter.indexOf(':'));
                        let filterText = query.filter.substring(query.filter.indexOf(':') + 1);
                        this.setState((prevState) => {
                            return {
                                filter: {
                                    ...prevState.filter,
                                    filterSelected: filterSelected,
                                    filterText: filterText
                                }
                            }
                        });
                        //filtering the main data based on the query
                        if (filterSelected != '' && filterText != '') {
                            this.filterApplications(filterSelected, filterText);
                        }
                    }
                    //if query contains sort details
                    if ('sort' in query) {
                        let sortBy = query.sort.substring(0, query.sort.indexOf(':'));
                        let order = query.sort.substring(query.sort.indexOf(':') + 1);
                        let sortQuery = [sortBy, order];
                        this.sortApplications(null, sortQuery);
                    }

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
                console.log(err);
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

    //update filter option
    changeFilterSelection = (e) => {
        let type = e.target.type;
        let value = e.target.value;
        if (type == 'text') {
            this.setState((prevState) => {
                return {
                    filter: {
                        ...prevState.filter,
                        filterText: value
                    }
                }
            });
        } else if (type == 'radio') {
            this.setState((prevState) => {
                return {
                    filter: {
                        ...prevState.filter,
                        filterSelected: value
                    }
                }
            });
        }
    }
    //update the url with filter query
    filterHandler = () => {
        //validation
        if (this.state.filter.filterSelected == '') {
            this.setState({
                alert: {
                    show: true,
                    msg: `Please select a category to filter`,
                    type: 'Error'
                }
            });
            return;
        }
        if (this.state.filter.filterText == '') {
            this.setState({
                alert: {
                    show: true,
                    msg: `Please enter a keyword to filter`,
                    type: 'Error'
                }
            });
            return;
        }
        this.updateQueryParameter();
        this.filterApplications(this.state.filter.filterSelected, this.state.filter.filterText);
    }

    //update the url with query parameter
    updateQueryParameter = () => {
        let queryParams = [];
        queryParams.push('filter=' + this.state.filter.filterSelected + ':' + encodeURIComponent(this.state.filter.filterText));
        queryParams.push('sort=' + this.state.sort.sortBy + ':' + this.state.sort.order);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '',
            search: '?' + queryString
        });
    }

    //carry out filtering operation
    filterApplications = (filterSelected, filterText, clear = false) => {
        let appData = [...this.props.masterData];
        if (clear) {
            this.props.updateAppData(appData);
            return;
        }

        let filteredAppData = appData.filter(obj => obj[filterSelected].toLowerCase().includes(filterText.toLowerCase()));
        this.props.updateAppData(filteredAppData);
    }

    //clear the filter inputs
    clearFilterAndSort = () => {
        this.props.history.push({
            pathname: ''
        });
        this.setState((prevState) => {
            return {
                filter: {
                    ...prevState.filter,
                    filterSelected: '',
                    filterText: ''
                },
                sort: {
                    sortBy: '',
                    order: ''
                }
            }
        });
        this.filterApplications('', '', true);

    }

    //decrypt query parameters
    fetchQueryParams = () => {
        let query = {}
        let queryParams = new URLSearchParams(this.props.location.search)
        for (let param of queryParams) {
            query[param[0]] = param[1].trim();
        }
        return query;
    }

    //sorting the list
    sortApplications = (e, sortQuery) => {
        let appData = [...this.props.appData];
        let sortBy;
        let sortedData;
        //if sorted during the componentDidMount
        if (sortQuery) {
            sortBy = sortQuery[0];
            this.setState({
                sort: {
                    sortBy: sortQuery[0],
                    order: sortQuery[1]
                }
            })
            switch (sortBy) {
                case 'year_of_experience':
                    sortedData = appData.sort((a, b) => {
                        if (sortQuery[1] == 'AZ') {
                            return a[sortBy] - b[sortBy];
                        } else return b[sortBy] - a[sortBy];
                    });
                    break;
                case 'position_applied':
                    sortedData = appData.sort((a, b) => {
                        if (sortQuery[1] == 'AZ') {
                            return (a[sortBy] > b[sortBy]) ? 1 : ((b[sortBy] > a[sortBy]) ? -1 : 0);
                        } else return (b[sortBy] > a[sortBy]) ? 1 : ((a[sortBy] > b[sortBy]) ? -1 : 0);
                    });
                    break;
                case 'application_date':
                    sortedData = appData.sort((a, b) => {
                        let x = new Date(a[sortBy]);
                        let y = new Date(b[sortBy]);
                        if (sortQuery[1] == 'AZ') {
                            return x - y;
                        } else return y - x;
                    })
                    break;
                default:
                    break;
            }
        }
        //if sorted manually by the user
        else {
            sortBy = e.target.id;
            if (this.state.sort.sortBy == sortBy) {
                sortedData = appData.reverse();
                this.setState(prevState => {
                    let order = prevState.sort.order == 'AZ' ? 'ZA' : 'AZ';
                    return {
                        sort: {
                            ...prevState.sort,
                            order: order
                        }
                    }
                }, () => this.updateQueryParameter())
            }
            else {
                this.setState({
                    sort: {
                        sortBy: sortBy,
                        order: 'AZ'
                    }
                }, () => this.updateQueryParameter())
                switch (sortBy) {
                    case 'year_of_experience':
                        sortedData = appData.sort((a, b) => a[sortBy] - b[sortBy]);
                        break;
                    case 'position_applied':
                        sortedData = appData.sort((a, b) => (a[sortBy] > b[sortBy]) ? 1 : ((b[sortBy] > a[sortBy]) ? -1 : 0));
                        break;
                    case 'application_date':
                        sortedData = appData.sort((a, b) => {
                            let x = new Date(a[sortBy]);
                            let y = new Date(b[sortBy]);
                            return x - y
                        })
                        break;
                    default:
                        break;
                }
            }
            //update the url with sort details
            // this.updateQueryParameter();
        }

        if (sortedData) {
            this.props.updateAppData(sortedData);
        }
    }



    render() {
        return (<div className={css.layout}>
            {this.state.loader ?
                <Loader /> :
                <>
                    <Alert
                        show={this.state.alert.show}
                        type={this.state.alert.type}
                        msg={this.state.alert.msg}
                        clicked={this.closeAlert} />
                    <p>Application Management</p>
                    <Header
                        filter={this.state.filter}
                        filterChanged={this.changeFilterSelection}
                        filterClicked={this.filterHandler}
                        filterCleared={this.clearFilterAndSort}
                    />
                    <ApplicationTable
                        clicked={this.sortApplications}
                        sortBy={this.state.sort.sortBy}
                        sortOrder={this.state.sort.order} />
                </>}
        </div>)
    }
}

const mapStateToProps = state => {
    return {
        appData: state.appData,
        masterData: state.masterData
    }
}
const mapDispatchToProps = dispatch => {
    return {
        updateAppData: (payload) => dispatch({ type: 'updateAppData', payload: payload }),
        updateHeadings: (headings) => dispatch({ type: 'updateHeadings', headings: headings }),
        updateMasterData: (payload) => dispatch({ type: 'updateMasterData', payload: payload }),
        // updateQuery: (query) =>dispatch({type: 'updateQuery', headings: query})
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);