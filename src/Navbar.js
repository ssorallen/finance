/* @flow */

import * as React from 'react';
import { Collapse, Nav, Navbar as ReactstrapNavbar, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

type Props = {
  isLoading: boolean,
  updatedAt: ?number,
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

class Navbar extends React.Component<Props> {
  render() {
    return (
      <ReactstrapNavbar color="dark" dark expand="md">
        <Collapse isOpen navbar>
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
            <div className="lds-ellipsis" title="Loading...">
              <div />
              <div />
              <div />
              <div />
            </div>
          ) : null}
          <span>
            <span className="text-white-50">Last updated: </span>
            <span className="text-white">
              {this.props.updatedAt == null
                ? 'never'
                : updatedAtFormatter.format(this.props.updatedAt)}
            </span>
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
