/* @flow */

import './App.css';
import * as React from 'react';
import { Col, Container, Row } from 'reactstrap';
import AddSymbolForm from './AddSymbolForm';
import Navbar from './Navbar';
import PerformanceRow from './PerformanceRow';
import type { Quote } from './reducers';
import { connect } from 'react-redux';

type Props = {
  isLoading: boolean,
  quotes: {[ticker: string]: Quote},
  symbols: Array<string>,
};

type State = {
  selectedSymbols: Set<string>,
};

function abbreviateNumber(num: number, fixed) {
  if (num === null) { return null; } // terminate early
  if (num === 0) { return '0'; } // terminate early
  fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
  const b = (num).toPrecision(2).split('e'); // get power
  const k = b.length === 1 ? 0 : Math.floor(Math.min(parseInt(b[1].slice(1), 10), 14) / 3); // floor at decimals, ceiling at trillions
  const d = k < 0 ? k : Math.abs(k); // enforce -0 is 0
  const c = d < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(1 + fixed); // divide by power
  const e = c + ['', 'K', 'M', 'B', 'T'][k]; // append power
  return e;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedSymbols: new Set(),
    };
  }

  render() {
    return (
      <div>
        <Navbar />
        <Container>
          <Row>
            <Col>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 1 }}><input type="checkbox" /></th>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Last Price</th>
                    <th>Change</th>
                    <th>Cost Basis</th>
                    <th>Mkt Value</th>
                    <th>Gain</th>
                    <th>Gain %</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.symbols.map(symbol =>
                    <PerformanceRow key={symbol} symbol={symbol} />
                  )}
                </tbody>
              </table>
            </Col>
          </Row>
          <Row>
            <Col md="6" style={{ marginBottom: '20px', marginTop: '20px' }}>
              <AddSymbolForm />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default connect(state => ({
  isLoading: state.isFetchingQuotes,
  quotes: state.quotes,
  symbols: state.symbols,
}))(App);

/* For displaying row of "Overview" page
<tr key={symbol}>
  <td style={{ width: 1 }}><input type="checkbox" /></td>
  <td>{quote == null ? '...' : quote.companyName}</td>
  <td>{symbol}</td>
  <td>{quote == null ? '...' : quote.latestPrice}</td>
  <td
    className={cx({
      'text-danger': quote && quote.change < 0,
      'text-success': quote && quote.change >= 0,
    })}>
    <QuoteChange quote={quote} />
  </td>
  <td>{quote == null ? '...' : abbreviateNumber(quote.marketCap, 1)}</td>
  <td>{quote == null ? '...' : quote.open}</td>
  <td>{quote == null ? '...' : quote.close}</td>
</tr>
*/
