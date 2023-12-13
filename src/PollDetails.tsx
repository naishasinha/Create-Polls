import React, { Component, ChangeEvent, MouseEvent } from 'react';
import { Poll, parsePoll } from './poll';
import { isRecord } from './record';


type DetailsProps = {
  name: string,
  onBackClick: () => void
};

type DetailsState = {
  now: number,
  poll: Poll | undefined,
  voter: string,
  option: string,
  updatedState: string,
  error: string,
};

  // Map from option to number of votes for that option.
  const optionVotes: Map<string, number> = new Map();
  // Map from voter name to chosen option.
  const voterVotes: Map<string, string> = new Map();

// Shows an individual poll and allows voting (if ongoing).
export class PollDetails extends Component<DetailsProps, DetailsState> {


  constructor(props: DetailsProps) {
    super(props);

    this.state = {now: Date.now(), poll: undefined,
                  voter: "", option: "", updatedState: "", error: ""};

    
  }

  componentDidMount = (): void => {
    this.doRefreshClick(); 
  };

  render = (): JSX.Element => {
    if (this.state.poll === undefined) {
      return <p>Loading poll "{this.props.name}"...</p>
    } else {
      if (this.state.poll.endTime <= this.state.now) {
        return this.renderCompleted(this.state.poll);
      } else {
        return this.renderOngoing(this.state.poll);
      }
    }
  };

  renderCompleted = (poll: Poll): JSX.Element => {
    const closedMinAgo = Math.round((this.state.now - poll.endTime) / 60 / 100) / 10;
    return (
      <div>
        <h2>{poll.name}</h2>
        <p>Closed {closedMinAgo} minutes ago.</p>
        {this.renderCalculations(poll.options)}
        <button type="button" onClick={this.doBackClick}>Back</button>
        <button type="button" onClick={this.doRefreshClick}>Refresh</button>
      </div>);
  };

  renderOngoing = (poll: Poll): JSX.Element => {
    const min = Math.round((poll.endTime - this.state.now) / 60 / 100) / 10;
    return (
      <div>
        <h2>{poll.name}</h2>
        <p><i>Closes in {min} minutes...</i></p>
        <div>
            {this.renderOptions(poll.options)}
        </div>
        <div>
          <label htmlFor="voter">Voter Name:</label>
          <input type="text" id="voter" value={this.state.voter} 
              onChange={this.doVoterChange}></input>
        </div>
        <button type="button" onClick={this.doBackClick}>Back</button>
        <button type="button" onClick={this.doRefreshClick}>Refresh</button>
        <button type="button" onClick={this.doVoteClick}>Vote</button>
        {this.renderError()}
        {this.renderUpdate()}
      </div>);
  };

  renderOptions = (options: string[]): JSX.Element => {
    const optionElements: JSX.Element[] = [];
  
    // Inv: optionElements contains JSX elements for options[0] to options[index - 1].
    for (const option of options) {
      optionElements.push(
        <div key={options.indexOf(option)}>
          {this.renderRadioInput(option)}
          <label htmlFor={option}>{option}</label>
        </div>
      );
    }
  
    return <ul>{optionElements}</ul>;
  };
  renderRadioInput = (option: string): JSX.Element => (
    <input
      type="radio"
      id={option}
      name="item"
      value={option}
      checked={this.state.option === option}
      onChange={() => this.doHandleOptionChange(option)}
    />
  );

  doHandleOptionChange = (selectedOption: string): void => {
    this.setState({ option: selectedOption });
  };

  renderCalculations = (options: string[]): JSX.Element => {
    const optionElements: JSX.Element[] = [];
    const totalVotes: number = voterVotes.size;
    console.log("total votes: ");
    console.log(totalVotes);
        // Inv: optionElements contains JSX elements for options[0] to options[index - 1].
        for (const option of options) {
            const numVotesCurr = optionVotes.get(option) === undefined ? 0 : optionVotes.get(option);

            if (numVotesCurr !== undefined) {
                console.log("number of votes for the current option:");
                console.log(numVotesCurr);
                console.log("number of total votes for this poll:");
                console.log(totalVotes);
                const percentage = Math.round((numVotesCurr / totalVotes)) * 100;
                console.log("percentage");
                console.log(percentage);
                optionElements.push(
                    <div key={options.indexOf(option)}>
                    <li>{percentage}% - {option}</li>
                  </div>
                );
            }

          }
          console.log(optionElements);
          console.log()
          return <ul>{optionElements}</ul>;
  }


  renderError = (): JSX.Element => {
    if (this.state.error.length === 0) {
      return <div></div>;
    } else {
      const style = {width: '300px', backgroundColor: 'rgb(246,194,192)',
          border: '1px solid rgb(137,66,61)', borderRadius: '5px', padding: '5px' };
      return (<div style={{marginTop: '15px'}}>
          <span style={style}><b>Error</b>: {this.state.error}</span>
        </div>);
    }
  };

  renderUpdate = (): JSX.Element => {
    if (this.state.updatedState.length === 0) {
      return <div></div>;
    } else {
      const style = {width: '300px', backgroundColor: 'rgb(144,238,144)',
          border: '1px solid rgb(137,66,61)', borderRadius: '5px', padding: '5px' };
      return (<div style={{marginTop: '15px'}}>
          <span style={style}>{this.state.updatedState}</span>
        </div>);
    }
  };

  doRefreshClick = (): void => {
    const args = {name: this.props.name};
    fetch("/api/get", {
        method: "POST", body: JSON.stringify(args), headers: {"Content-Type": "application/json"}
    })
    .then((res) => this.doGetResp(res))
    .catch(() => this.doGetError("failed to connect to server"));
  };

  doGetResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doGetJson)
          .catch(() => this.doGetError("200 res is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doGetError)
          .catch(() => this.doGetError("400 response is not text"));
    } else {
      this.doGetError(`bad status code from /api/refresh DOGETRESP: ${res.status}`);
    }
  };

  doGetJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/refresh: not a record", data);
      return;
    }

    this.doPollChange(data);
  }

  // Shared helper to update the state with the new poll.
  doPollChange = (data: {poll?: unknown}): void => {
    const poll = parsePoll(data.poll);
    if (poll !== undefined) {
        this.setState({poll: poll, now: Date.now(), error: ""});

    } else {
      console.error("poll from /api/fresh did not parse", data.poll)
    }
  };

  doGetError = (msg: string): void => {
    console.error(`Error fetching /api/refresh: ${msg}`);
  };

  doVoterChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({voter: evt.target.value, error: ""});
  };
  
  doVoteClick = (_: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.poll === undefined)
      throw new Error("impossible");

    // Verify that the user entered all required information.
    // UPDATE FOR THE REST OF THE VARIABLES
    if (this.state.voter.trim().length === 0) {
      this.setState({error: "a required field is missing."});
      return;
    }

    // verify that vote is selected

    const args = {name: this.props.name, voter: this.state.voter, option: this.state.option};
    fetch("/api/vote", {
        method: "POST", body: JSON.stringify(args),
        headers: {"Content-Type": "application/json"} })
      .then(this.doVoteResp)
      .catch(() => this.doVoteError("failed to connect to server"));


      const currOption = this.state.option;
      const currVoter = this.state.voter;
      if (currVoter === undefined) {
        this.setState({error: "a required field is missing."});
      } else if (voterVotes === undefined) {
        this.setState({error: "a required field is missing."});
      } else if (voterVotes.has(currVoter)) {
        voterVotes.set(currVoter, currOption);
        this.setState({updatedState: `Updated vote of ${this.state.voter} as ${this.state.option}`})
      } else {
        voterVotes.set(currVoter, currOption);
        this.setState({updatedState: `Recorded vote of ${this.state.voter} as ${this.state.option}`});
      }

      // Count occurrences of each option.
      for (const option of voterVotes.values()) {
        const count = optionVotes.get(option) || 0;
        optionVotes.set(option, count + 1);
      }


  };

  doVoteResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doVoteJson)
          .catch(() => this.doVoteError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doVoteError)
          .catch(() => this.doVoteError("400 response is not text"));
    } else {
      this.doVoteError(`bad status code from /api/vote: ${res.status}`);
    }
  };

  doVoteJson = (data: unknown): void => {
    if (this.state.poll === undefined)
      throw new Error("impossible");

    if (!isRecord(data)) {
      console.error("bad data from /api/vote: not a record", data);
      return;
    }

    this.doPollChange(data);
  };

  doVoteError = (msg: string): void => {
    console.error(`Error fetching /api/vote: ${msg}`);
  };

  doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
    this.props.onBackClick();  // tell the parent to show the full list again
  };
}
