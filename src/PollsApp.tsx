import React, { Component } from "react";
import { PollList } from './PollsList';
import { PollDetails } from './PollDetails';
import { NewPoll } from './NewPoll';


type Page = "list" | "new" | {kind: "details", name: string};

type PollsAppState = {
  page: Page;
}

const DEBUG: boolean = true;

/** Displays the UI of the Polls application. */
export class PollsApp extends Component<{}, PollsAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {page: "list"};
  }
  
  render = (): JSX.Element => {
    if (this.state.page === "list") {
      if (DEBUG) console.debug("rendering list page");
      return <PollList onNewClick={this.doNewClick}
                          onPollClick={this.doPollClick}/>;

    } else if (this.state.page === "new") {
      if (DEBUG) console.debug("rendering add page");
      return <NewPoll onBackClick={this.doBackClick}/>;

    } else {  // details
      if (DEBUG) console.debug(`rendering details page for "${this.state.page.name}"`);
      return <PollDetails name={this.state.page.name}
                             onBackClick={this.doBackClick}/>;
    }
  };

  doNewClick = (): void => {
    if (DEBUG) console.debug("set state to new");
    this.setState({page: "new"});
  };

  doPollClick = (name: string): void => {
    if (DEBUG) console.debug(`set state to details for poll ${name}`);
    this.setState({page: {kind: "details", name}});
  };

  doBackClick = (): void => {
    if (DEBUG) console.debug("set state to list");
    this.setState({page: "list"});
  };
  
}