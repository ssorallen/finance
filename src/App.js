/* @flow */

import './App.css';
import * as React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import type { Dispatch } from './types';
import Navbar from './Navbar';
import Overview from './Overview';
import Performance from './Performance';
import Stock from './Stock';
import Transactions from './Transactions';
import { fetchAllQuotes } from './actions';
import { useDispatch } from 'react-redux';

export default function App(): React.Node {
  const dispatch = useDispatch<Dispatch>();
  React.useEffect(() => {
    dispatch(fetchAllQuotes());
  }, [dispatch]);

  return (
    <Router>
      <div>
        {/* Wrap the `Navbar` in a pathless route to ensure it is always rendered and always updates
            on navigation. Updates are blocked because internally the `Navbar` is wrapped by
            react-redux's `connect`.

            See: React Router's ["Dealing With Update Blocking"][0] */}
        <Route component={Navbar} />
        <Route exact path="/" component={Overview} />
        <Route path="/performance" component={Performance} />
        <Route path="/stocks/:symbol" component={Stock} />
        <Route path="/transactions" component={Transactions} />
        <footer className="bg-light py-4">
          <Container>
            <Row>
              <Col>
                <small className="text-secondary">
                  Created by Ross Allen &lt;
                  <a className="link-secondary" href="https://github.com/ssorallen">
                    ssorallen
                  </a>
                  &gt;{' '}
                  <span aria-label="" role="img">
                    🦉
                  </span>
                </small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-secondary">
                  Source available at{' '}
                  <a className="link-secondary" href="https://github.com/ssorallen/finance">
                    ssorallen/finance
                  </a>
                </small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-secondary">
                  Data provided by{' '}
                  <a className="link-secondary" href="https://iexcloud.io">
                    IEX Cloud
                  </a>
                </small>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

// [0]: https://github.com/ReactTraining/react-router/blob/4b61484ec9eea4bc3a2eb36028c47934414542ae/packages/react-router/docs/guides/blocked-updates.md
