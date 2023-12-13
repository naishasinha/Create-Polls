import React, { Component, MouseEvent } from 'react';
import { Poll, parsePoll } from './poll';
import { isRecord } from './record';


type ListProps = {
  onNewClick: () => void,
  onPollClick: (name: string) => void
};

type ListState = {
  now: number,  // current time when rendering
  polls: Poll[] | undefined,
};

// Shows the list of all the auctions.
export class PollList extends Component<ListProps, ListState> {

  constructor(props: ListProps) {
    super(props);
    this.state = {now: Date.now(), polls: undefined};
  }

  componentDidMount = (): void => {
    this.doRefreshClick();
  }

  componentDidUpdate = (prevProps: ListProps): void => {
    if (prevProps !== this.props) {
      this.setState({now: Date.now()});  // Force a refresh
    }
  };

  render = (): JSX.Element => {
    console.log(this.state.polls);
    return (
      <div>
        <h1>Current Polls</h1>
        {this.renderOpenPolls()}
        <button type="button" onClick={this.doRefreshClick}>Refresh</button>
        <button type="button" onClick={this.doNewClick}>New Poll</button>
      </div>);
  };

  renderOpenPolls = (): JSX.Element => {
    if (this.state.polls === undefined) {
      return <p>No open polls.</p>;
    } else {
      const polls: JSX.Element[] = [];
      for (const poll of this.state.polls) {
        const min = (poll.endTime - this.state.now) / 60 / 1000;
        const over = (this.state.now - poll.endTime) / 60 / 1000;
        const desc = (min < 0) ? <span> – Closed {Math.round(over)} minutes ago</span> :
            <span> – {Math.round(min)} minutes remaining</span>;
                polls.push(
                    <li key={poll.name}>
                      <a href="#" onClick={(evt) => this.doPollClick(evt, poll.name)}>{poll.name}</a>
                      <span>{desc}</span>
                    </li>);


      }
      console.log(polls);
      return <ul>{polls}</ul>;
    }
  };


  doListResp = (resp: Response): void => {
    if (resp.status === 200) {
      resp.json().then(this.doListJson)
          .catch(() => this.doListError("200 response is not JSON"));
    } else if (resp.status === 400) {
      resp.text().then(this.doListError)
          .catch(() => this.doListError("400 response is not text"));
    } else {
      this.doListError(`bad status code from /api/list: ${resp.status}`);
    }
  };

  doListJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/list: not a record", data);
      return;
    }

    if (!Array.isArray(data.polls)) {
      console.error("bad data from /api/list: polls is not an array", data);
      return;
    }

    const polls: Poll[] = [];
    for (const val of data.polls) {
      const poll = parsePoll(val);
      if (poll === undefined)
        return;
      polls.push(poll);
    }
    this.setState({polls, now: Date.now()});  // fix time also
  };

  doListError = (msg: string): void => {
    console.error(`Error fetching /api/list: ${msg}`);
  };

  doRefreshClick = (): void => {
    fetch("/api/list").then(this.doListResp)
        .catch(() => this.doListError("failed to connect to server"));
  };

  doNewClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onNewClick();  // tell the parent to show the new poll page
  };

  doPollClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
    evt.preventDefault();
    this.props.onPollClick(name);
  };
}