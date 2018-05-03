/* @flow */

import './App.css';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import React from 'react';
import { connect } from 'react-redux';
import { addTicker } from './actions';

type Props = {
  dispatch: Function,
  tickers: Array<string>,
};

type State = {
  tickerValue: string,
};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tickerValue: '',
    };
  }

  addTicker = (event: SyntheticEvent<HTMLElement>) => {
    event.preventDefault();
    this.props.dispatch(addTicker(this.state.tickerValue));
    this.setState({tickerValue: ''});
  }

  handleChangeTickerValue = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ tickerValue: event.currentTarget.value });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Form action="/api" method="post" onSubmit={this.addTicker}>
              <FormGroup>
                <Label for="ticker">Ticker</Label>
                <Input
                  id="ticker"
                  name="ticker"
                  onChange={this.handleChangeTickerValue}
                  value={this.state.tickerValue}
                />
              </FormGroup>
              <FormGroup>
                <Button type="submit">Add</Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>Tickers</h4>
            <table>
              <thead>
                <tr>
                  <td>Ticker</td>
                </tr>
              </thead>
              <tbody>
                {this.props.tickers.map(ticker => (
                  <tr key={ticker}>
                    <td>{ticker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(state => ({
  tickers: state.tickers,
}))(App);
