/* @flow */

import './PortfolioNav.css';
import * as React from 'react';
import { Nav, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';

export default function PortfolioNav(): React.Node {
  return (
    <div className="bg-light shadow-sm nav-scroller">
      <Nav className="nav-portfolio" role="navigation">
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
    </div>
  );
}
