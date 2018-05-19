/* @flow */

import * as React from 'react';
import { Nav, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';

export default class PortfolioNav extends React.Component<{}> {
  render() {
    return (
      <Nav className="mt-3" role="navigation" tabs>
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
    );
  }
}
