/* @flow */

import * as React from 'react';
import {
  Collapse,
  Nav,
  Navbar as ReactstrapNavbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import SpinKit from './SpinKit';
import { connect } from 'react-redux';

type Props = {
  isLoading: boolean,
  updatedAt: ?number,
};

type State = {
  isOpen: boolean,
};

const updatedAtFormatter = new window.Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  hour: 'numeric',
  hour12: false,
  minute: 'numeric',
  month: 'numeric',
  second: 'numeric',
  year: 'numeric',
});

class Navbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    // Create local reference to `updatedAt` to enable Flow refinement beyond `null | undefined`.
    const { updatedAt } = this.props;
    return (
      <ReactstrapNavbar color="dark" dark expand="md">
        <NavbarBrand className="text-warning" tag={NavLink} to="/">
          stocks!!!
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink className="nav-link" exact to="/">
                Overview
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to="/performance">
                Performance
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to="/transactions">
                Transactions
              </NavLink>
            </NavItem>
          </Nav>
          {this.props.isLoading ? (
            <SpinKit title="Fetching new quotes..." type="folding-cube" />
          ) : null}
          <span>
            <span className="text-white-50">Last updated: </span>
            {updatedAt == null ? (
              <span className="text-white">never</span>
            ) : (
              <time className="text-white" dateTime={new Date(updatedAt).toISOString()}>
                {updatedAtFormatter.format(updatedAt)}
              </time>
            )}
          </span>
        </Collapse>
      </ReactstrapNavbar>
    );
  }
}

export default connect(state => ({
  isLoading: state.isFetchingQuotes,
  updatedAt: state.updatedAt,
}))(Navbar);
