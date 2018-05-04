/* @flow */

import * as React from 'react';
import { Collapse, Nav, Navbar as ReactstrapNavbar, NavItem, NavLink } from 'reactstrap';
import { connect } from 'react-redux';

type Props = {
  isLoading: boolean,
};

class Navbar extends React.Component<Props> {
  render() {
    return (
      <ReactstrapNavbar color="dark" dark expand="md">
        <Collapse isOpen navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/">Overview</NavLink>
            </NavItem>
            <NavItem>
              <NavLink active href="/performance">Performance</NavLink>
            </NavItem>
          </Nav>
          {this.props.isLoading ?
            <div className="lds-ellipsis" title="Loading...">
              <div />
              <div />
              <div />
              <div />
            </div> :
            null}
        </Collapse>
      </ReactstrapNavbar>
    );
  }
}

export default connect(state => ({
  isLoading: state.isFetchingQuotes,
}))(Navbar);
