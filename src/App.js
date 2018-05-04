/* @flow */

import './App.css';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import React from 'react';
import type { Quote } from './reducers';
import { connect } from 'react-redux';
import cx from 'classnames';
import { addTicker, fetchQuotes } from './actions';

type Props = {
  dispatch: Function,
  quotes: {[ticker: string]: Quote},
  tickers: Array<string>,
};

type State = {
  tickerValue: string,
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

function QuoteChange(props: { quote: ?Quote }) {
  const { quote } = props;
  if (quote == null) return '...';
  else {
    const isPositive = quote.change >= 0;
    return (
      <React.Fragment>
        {isPositive ? '+' : ''}{quote.change}{' '}
        ({isPositive ? '+' : ''}{Math.round(quote.changePercent * 10000) / 100}%)
      </React.Fragment>
    );
  }
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tickerValue: '',
    };
  }

  addTicker = (event: SyntheticEvent<HTMLElement>) => {
    event.preventDefault();
    this.props.dispatch(addTicker(this.state.tickerValue.toUpperCase()));
    this.props.dispatch(fetchQuotes());
    this.setState({ tickerValue: '' });
  }

  handleChangeTickerValue = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ tickerValue: event.currentTarget.value });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col md="6" style={{ marginBottom: '20px', marginTop: '20px' }}>
            <div className="card">
              <div className="card-body">
                <Form action="/api" method="post" onSubmit={this.addTicker}>
                  <FormGroup>
                    <Label for="ticker">Symbol</Label>
                    <Input
                      id="ticker"
                      name="ticker"
                      onChange={this.handleChangeTickerValue}
                      value={this.state.tickerValue}
                    />
                  </FormGroup>
                  <FormGroup style={{ marginBottom: 0 }}>
                    <Button type="submit">Add</Button>
                  </FormGroup>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
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
                  <th>Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {this.props.tickers.map(ticker => {
                  const quote = this.props.quotes[ticker];
                  return (
                    <tr key={ticker}>
                      <td style={{ width: 1 }}><input type="checkbox" /></td>
                      <td>{quote == null ? '...' : quote.companyName}</td>
                      <td>{ticker}</td>
                      <td>{quote == null ? '...' : quote.latestPrice}</td>
                      <td
                        className={cx({
                          'text-danger': quote && quote.change < 0,
                          'text-success': quote && quote.change >= 0,
                        })}>
                        <QuoteChange quote={quote} />
                      </td>
                      <td>{quote == null ? '...' : abbreviateNumber(quote.marketCap, 1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(state => ({
  quotes: state.quotes,
  tickers: state.tickers,
}))(App);
