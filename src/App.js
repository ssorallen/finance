/* @flow */

import "./App.css";
import * as React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import type { Dispatch } from "./types";
import Navbar from "./Navbar";
import SpinKit from "./SpinKit";
import { fetchAllQuotes } from "./actions";
import { useDispatch } from "react-redux";

const Overview = React.lazy(() => import("./Overview"));
const Performance = React.lazy(() => import("./Performance"));
const Stock = React.lazy(() => import("./Stock"));
const Transactions = React.lazy(() => import("./Transactions"));

function LoadingIndicator() {
  return (
    <div className="container my-3">
      <div className="d-flex align-items-center">
        <SpinKit className="mr-2" type="folding-cube" />
        Loading…
      </div>
    </div>
  );
}

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
        <React.Suspense fallback={<LoadingIndicator />}>
          <Route exact path="/" component={Overview} />
          <Route path="/performance" component={Performance} />
          <Route path="/stocks/:symbol" component={Stock} />
          <Route path="/transactions" component={Transactions} />
        </React.Suspense>
        <footer className="bg-light py-4">
          <Container>
            <Row>
              <Col>
                <small className="text-secondary">
                  Data provided by{" "}
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
