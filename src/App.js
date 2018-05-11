/* @flow */

import './App.css';
import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import AddSymbolForm from './AddSymbolForm';
import Navbar from './Navbar';
import Overview from './Overview';
import Performance from './Performance';
import Stock from './Stock';
import Transactions from './Transactions';
import { connect } from 'react-redux';
import { fetchQuotes } from './actions';

type StateProps = {
  dispatch: Function,
};

type Props = StateProps;

class App extends React.Component<Props> {
  componentDidMount() {
    // Fetch quotes when the app first launches. Fetching quotes automatically resets a time, and
    // the app from here on out will periodicaly fetch quotes to stay updated. This also enables the
    // user to refresh quotes by using browser refresh.
    this.props.dispatch(fetchQuotes());
  }

  render() {
    return (
      <Router basename="/finance">
        <div>
          {/* Wrap the `Navbar` in a pathless route to ensure it is always rendered and always
              updates on navigation. Updates are blocked because internally the `Navbar` is wrapped
              by react-redux's `connect`.

              See: React Router's ["Dealing With Update Blocking"][0] */}
          <Route component={Navbar} />
          <Container className="mb-4">
            <Route exact path="/" component={Overview} />
            <Route path="/performance" component={Performance} />
            <Route path="/stocks/:symbol" component={Stock} />
            <Route path="/transactions" component={Transactions} />
            <Row>
              <Col md="6">
                <AddSymbolForm />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <small className="text-secondary">
                  Created by{' '}
                  <a className="link-secondary" href="https://github.com/ssorallen">
                    ssorallen
                  </a>{' '}
                  &middot; Source available at{' '}
                  <a className="link-secondary" href="https://github.com/ssorallen/finance">
                    ssorallen/finance
                  </a>{' '}
                  <span aria-label="" role="img">
                    🦉
                  </span>
                </small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-secondary">
                  Data provided for free by{' '}
                  <a className="link-secondary" href="https://iextrading.com/developer/">
                    IEX
                  </a>{' '}
                  &middot; Use is subject to{' '}
                  <a className="link-secondary" href="https://iextrading.com/api-exhibit-a/">
                    IEX Exhibit A
                  </a>
                </small>
              </Col>
            </Row>
          </Container>
        </div>
      </Router>
    );
  }
}

export default connect()(App);

// [0]: https://github.com/ReactTraining/react-router/blob/4b61484ec9eea4bc3a2eb36028c47934414542ae/packages/react-router/docs/guides/blocked-updates.md
