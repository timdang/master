import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import JobData from '../components/jobview/JobData';
import { addNote, deleteNote, deleteJob, addEvent, addContact } from '../config/actions';

class JobViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteTxt: '',
      date: '',
      text: '',
      c_name: '',
      c_email: '',
      c_phone: '',
      open: false,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleText = this.handleText.bind(this);
    this.handleNote = this.handleNote.bind(this);
    this.handleDeleteNote = this.handleDeleteNote.bind(this);
    this.postReminder = this.postReminder.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.handleContactName = this.handleContactName.bind(this);
    this.handleContactEmail = this.handleContactEmail.bind(this);
    this.handleContactPhone = this.handleContactPhone.bind(this);
    this.handleContact = this.handleContact.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onTextChange(e) {
    this.setState({ text: e.target.value });
  }

  onDateChange(err, value) {
    const newDate = this.formatDate(value);
    const stringDate = newDate.toString();
    this.setState({ date: stringDate });
  }

  handleContactName(e) {
    this.setState({ c_name: e.target.value });
  }

  handleContactEmail(e) {
    this.setState({ c_email: e.target.value });
  }

  handleContactPhone(e) {
    this.setState({ c_phone: e.target.value });
  }

  handleContact(event) {
    event.preventDefault();
    this.props.dispatch(addContact({
      name: this.state.c_name,
      email: this.state.c_email,
      phone: this.state.c_phone,
    }, this.props.jobID));
    this.setState({ c_name: '', c_email: '', c_phone: '' });
  }

  handleText(e) {
    this.setState({ noteTxt: e.target.value });
  }

  handleNote(event) {
    event.preventDefault();
    this.props.dispatch(addNote({ noteTxt: this.state.noteTxt }, this.props.jobID));
    this.setState({ noteTxt: '' });
  }


  handleDeleteNote(index, props) {
    this.props.dispatch(deleteNote(props.job.id, index));
    this.setState({ noteTxt: e.target.value });
  }

  handleDelete() {
    this.props.dispatch(deleteJob(this.props.jobID));
    browserHistory.push('/dashboard');
  }

  formatDate(date) {
    return `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`;
  }

  postReminder() {
    const reminder = this.noteVal;
    this.props.dispatch(addEvent(reminder));
    this.setState({ date: '', text: '' });
    this.handleOpen();
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <div>
        <h2>Job View</h2>
        <div className="deleteJob">
          <FlatButton label="New" disabled />
          <FlatButton label="Pending" primary />
          <FlatButton label="Closed" primary />
        </div>
        <JobData
          job={this.props.job}
          postReminder={this.postReminder}
          onDateChange={this.onDateChange}
          onTextChange={this.onTextChange}
          dateVal={this.state.date}
          value={this.state.text}

          onHandleDelete={this.handleDelete}
          onDeleteNote={this.handleDeleteNote}
          handleOpen={this.handleOpen}
          handleClose={this.handleClose}
          open={this.state.open}

          formatDate={this.formatDate}
          onHandleDelete={this.handleDelete}

          submitNote={this.handleNote}
          noteVal={this.state.noteTxt}
          onTextAdd={this.handleText}
          onDeleteNote={this.handleDeleteNote}

          submitContact={this.handleContact}
          stateName={this.state.c_name}
          stateEmail={this.state.c_email}
          statePhone={this.state.c_phone}
          onContactPhone={this.handleContactPhone}
          onContactEmail={this.handleContactEmail}
          onContactName={this.handleContactName}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let jobID;
  let dbUserID;
  if (state.get('app')) jobID = state.get('app').toJS().currentJob;
  if (state.get('app')) dbUserID = state.get('app').toJS().dbUserID;
  const jobs = state.get('jobs').toJS().filter(job => job.id === jobID);
  const job = jobs[0];
  return {
    jobID,
    job,
    dbUserID,
  };
};

JobViewContainer.propTypes = {
  jobID: PropTypes.string.isRequired,
  job: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  postReminder: PropTypes.func,
};

export default connect(mapStateToProps)(JobViewContainer);
