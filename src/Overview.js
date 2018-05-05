/* @flow */

import * as React from 'react';
import { Col, Row } from 'reactstrap';
import OverviewRow from './OverviewRow';
import { connect } from 'react-redux';

type StateProps = {
  symbols: Array<string>,
};

type Props = StateProps;

class Performance extends React.Component<Props> {
  render() {
    return (
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
                <th>Market Cap</th>
                <th>Open</th>
                <th>Close</th>
              </tr>
            </thead>
            <tbody>
              {this.props.symbols.length === 0 ? (
                <tr>
                  <td className="text-center" colSpan="8">
                    No symbols yet. Add one using the form below.
                  </td>
                </tr>
              ) : (
                this.props.symbols.map(symbol => <OverviewRow key={symbol} symbol={symbol} />)
              )}
            </tbody>
          </table>
        </Col>
      </Row>
    );
  }
}

export default connect(state => ({
  symbols: state.symbols,
}))(Performance);
