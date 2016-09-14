import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import SearchBar from '../components/jobsearch/SearchBar';
import ResultsViewComponent from '../components/jobsearch/ResultsView';
import { addJob, dbRequest, dbSuccess, dbFailure } from '../config/actions';

class JobSearchContainer extends Component {
  constructor() {
    super();
    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.saveJobsToStore = this.saveJobsToStore.bind(this);

    this.state = {
      data: [],
      jobsSelected: {},
      keywords: '',
      location: '',
      open: false,
    };
  }

  componentDidMount() {}

  // this method cleans up job descriptions that
  // come back from the api with html tags
  strip(html) {
    html = html.replace('\n\n', ' ');
    html = html.replace('\n', ' ');
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  handleKeyChange(e) {
    this.setState({ keywords: e.target.value });
  }

  handleLocationChange(e) {
    this.setState({ location: e.target.value });
  }

  handleSearch(event) {
    event.preventDefault();
    this.handleSearchSubmit(this.state.keywords, this.state.location);
    this.setState({ keywords: '', location: '' });
  }

  handleSearchSubmit(keyword, location) {
    this.setState({ data: [] });
    this.setState({ jobsSelected: {} });
    let githubParams = `/api/jobs/github/${keyword.replace(/ /g, '+')}`;
    if (location.length) {
      githubParams += `/${location.replace(/ /g, '+')}`;
    }
    let usajobsParams = `/api/jobs/usajobs/${keyword.replace(/ /g, '+')}`;
    if (location.length) {
      usajobsParams += `/${location.replace(/ /g, '+')}`;
    }

    this.props.dispatch(dbRequest());
    axios.get(githubParams).then((response) => {
      const nextState = this.state.data.slice();
      response.data.forEach((job) => nextState.push(job));
      this.setState({ data: nextState });
      this.props.dispatch(dbSuccess());
    }).catch((err) => this.props.dispatch(dbFailure(err)));

    axios.get(usajobsParams).then((response) => {
      const nextState = this.state.data.slice();
      response.data.forEach((job) => nextState.push(job));
      this.setState({ data: nextState });
    }).catch((response) => console.log('error', response));
  }

  handleRowClick(row) {
    const job = this.state.data[row];
    if (this.state.jobsSelected[job.id]) {
      delete this.state.jobsSelected[job.id];
    } else {
      this.state.jobsSelected[job.id] = job;
    }
  }

  saveJobsToStore() {
    for (const jobID in this.state.jobsSelected) {
      if (this.state.jobsSelected.hasOwnProperty(jobID)) {
        this.state.jobsSelected[jobID].description = this.strip(this.state.jobsSelected[jobID].description).slice(0, 500).concat('...');
        this.props.dispatch(addJob(this.state.jobsSelected[jobID]));
      }
    }
    this.handleOpen();
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    browserHistory.push('/dashboard');
  }

  render() {
    const actions =
      [
        <FlatButton
          label="OK"
          primary
          onMouseDown={this.handleClose}
        />,
      ];

    return (
      <div>
        <h2>Job Search</h2>
        <SearchBar
          keywords={this.state.keywords}
          location={this.state.location}
          onHandleSearch={this.handleSearch} onHandleLocationChange={this.handleLocationChange}
          onHandleKeyChange={this.handleKeyChange}
          isWorking={this.props.isWorking}
        />
        <br /><br />
        <div
          className={this.state.data.length > 0
            ? 'show'
            : 'hide'}
        >
          <ResultsViewComponent
            data={this.state.data}
            onRowClick={this.handleRowClick}
            onHandleSubmit={this.handleSubmit}
          /><br /><br />
          <div className="addJobButtons">
            <FloatingActionButton mini className="button-circle" onMouseDown={this.saveJobsToStore}>
              <ContentAdd />
            </FloatingActionButton>
            <span className="button-circle-text">Add Jobs</span>
            <br /><br /><br /><br />
          </div>
        </div>
        <Dialog title="Jobs Added!" actions={actions} modal open={this.state.open}>
            The selected jobs have been added to your dashboard.
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const isWorking = state.get('db').toJS().isWorking;
  return { isWorking };
};

JobSearchContainer.propTypes = {
  isWorking: PropTypes.bool,
  dispatch: PropTypes.func,
};

export default connect(mapStateToProps)(JobSearchContainer);
