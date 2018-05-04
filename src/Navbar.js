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
      <ReactstrapNavbar color="dark" dark>
        <Collapse isOpen navbar>
          {this.props.isLoading ?
            <div style={{ float: 'right', lineHeight: '32px' }}>
              <div className="lds-ellipsis" style={{ float: 'right' }} title="Loading...">
                <div />
                <div />
                <div />
                <div />
              </div>
            </div> :
            null}
          <Nav navbar>
            <NavItem>
              <NavLink active href="/">Overview</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </ReactstrapNavbar>
    );
  }
}

export default connect(state => ({
  isLoading: state.isFetchingQuotes,
}))(Navbar);
