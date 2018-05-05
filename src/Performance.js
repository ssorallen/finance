/* @flow */

import * as React from 'react';
import { Button, Col, Row } from 'reactstrap';
import PerformanceRow from './PerformanceRow';
import { connect } from 'react-redux';

type StateProps = {
  symbols: Array<string>,
};

type Props = StateProps;

class Performance extends React.Component<Props> {
  render() {
    return (
      <React.Fragment>
        <Row className="mb-3 mt-3">
          <Col>
            <Button color={'secondary'} disabled outline size="sm">
              Delete
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 1 }}>
                    <input type="checkbox" />
                  </th>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Last Price</th>
                  <th>Change</th>
                  <th>Shares</th>
                  <th>Cost Basis</th>
                  <th>Mkt Value</th>
                  <th>Gain</th>
                  <th>Gain %</th>
                </tr>
              </thead>
              <tbody>
                {this.props.symbols.length === 0 ? (
                  <tr>
                    <td className="text-center" colSpan="10">
                      No symbols yet. Add one using the form below.
                    </td>
                  </tr>
                ) : (
                  this.props.symbols.map(symbol => <PerformanceRow key={symbol} symbol={symbol} />)
                )}
              </tbody>
            </table>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default connect(state => ({
  symbols: state.symbols,
}))(Performance);
