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
            filterBy: ['name', 'status', 'position_applied'],  //available filtering options
            filterText: '',
            filterSelected: ''
        },
        sort: {
            applicableTo: ['year_of_experience', 'position_applied', 'application_date'], // available sorting options
            sortBy: '',
            order: ''
        }
    }

    componentDidMount = () => {
        this.fetchAppData();
    }

    //contacting server API to fetch the details of all applications
    fetchAppData = () => {
        this.setState({ loader: true });
        axios.get('https://personio-fe-test.herokuapp.com/api/v1/candidates')
            .then(response => {
                if (response.data.data) {
                    let headings = []
                    for (let i in response.data.data[0]) {
                        headings.push(i);
                    }
                    this.props.updateMasterData(response.data.data); //masterData for backup
                    this.props.updateAppData(response.data.data); //appData for carrying out our logic
                    this.props.updateHeadings(headings); //list of headings to diaplay in the table

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
                        //filtering the appData based on the query
                        if (filterSelected != '' && filterText != '') {
                            this.filterApplications(filterSelected, filterText);
                        }
                    }
                    //if query contains sort details
                    if ('sort' in query) {
                        let sortBy = query.sort.substring(0, query.sort.indexOf(':'));
                        let order = query.sort.substring(query.sort.indexOf(':') + 1);
                        let sortQuery = [sortBy, order];
                        //sorting the appData based on the query
                        this.sortApplications(null, sortQuery);
                    }

                } else {
                    //Alert for Err if status is successfull 200
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
                //Alert for Err if API server cannot be reached
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

    //update the filter state object whenever the user changes the filter options(onChange listener)
    changeFilterSelection = (e) => {
        let type = e.target.type;
        let value = e.target.value;
        //changing filter selection if input type is text
        if (type == 'text') {
            this.setState((prevState) => {
                return {
                    filter: {
                        ...prevState.filter,
                        filterText: value
                    }
                }
            });
        }
        //changing filter selection if input type is radio
        else if (type == 'radio') {
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
        //validation: is any radio selected
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
        //validation: filter text should not be empty
        if (this.state.filter.filterText.trim() == '') {
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
        this.filterApplications(this.state.filter.filterSelected, this.state.filter.filterText.trim());
    }

    //update the url with query parameter
    updateQueryParameter = () => {
        let queryParams = [];
        queryParams.push('filter=' + this.state.filter.filterSelected + ':' + encodeURIComponent(this.state.filter.filterText.trim()));
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
        //alerting the user if no records found
        if (filteredAppData.length == 0) {
            this.setState({
                alert: {
                    show: true,
                    msg: `Sorry. No matching records found!.Please try filtering with different options`,
                    type: 'Error'
                }
            });
            return;
        }
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
                    ...prevState.sort,
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
        //Sorting during the component's initial Mounting
        if (sortQuery) {
            if (!(this.state.sort.applicableTo.includes(sortBy))) {
                return;
            }
            console.log('sortQuery')
            sortBy = sortQuery[0];
            this.setState(prevState => {
                return {
                    sort: {
                        ...prevState.sort,
                        sortBy: sortQuery[0],
                        order: sortQuery[1]
                    }
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
                    return;
            }
        }
        //Sorting during the application runtime
        else {
            sortBy = e.target.id;
            if (!(this.state.sort.applicableTo.includes(sortBy))) {
                return;
            }
            //if already sorted reverse the order
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
                this.setState(prevState => {
                    return {
                        sort: {
                            ...prevState.sort,
                            sortBy: sortBy,
                            order: 'AZ'
                        }
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
                        return;
                }
            }
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
                        sortOrder={this.state.sort.order}
                        applicableTo={this.state.sort.applicableTo} />
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
        updatePaginatedData: (paginatedData) => dispatch({ type: 'updatePaginatedData', paginatedData: paginatedData })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);