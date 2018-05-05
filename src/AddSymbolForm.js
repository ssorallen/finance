/* @flow */

import * as React from 'react';
import { Button, Collapse, Form, FormGroup, Input, Label } from 'reactstrap';
import { addSymbol, addTransaction, fetchQuotes } from './actions';
import { connect } from 'react-redux';
import formSerialize from 'form-serialize';

type Props = {
  dispatch: Function,
  isLoading: boolean,
  onSubmit?: (formData: Object) => void,
};

type State = {
  showTransactionData: boolean,
};

class AddSymbolForm extends React.Component<Props, State> {
  formRef: ?HTMLFormElement;

  constructor(props) {
    super(props);
    this.state = {
      showTransactionData: false,
    };
  }

  handleHideTransactionData = () => {
    this.setState({ showTransactionData: false });
  };

  handleShowTransactionData = () => {
    this.setState({ showTransactionData: true });
  };

  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = formSerialize(event.currentTarget, { hash: true });

    // Set some defaults and override the ticker to make sure it's always UPPERCASE.
    const transaction = {
      commission: parseFloat(formData.commission) || 0,
      date: formData.date,
      price: parseFloat(formData.price) || 0,
      shares: parseFloat(formData.shares) || 0,
      symbol: formData.ticker.toUpperCase(),
      type: formData.type,
    };

    this.props.dispatch(addSymbol(transaction.symbol));
    this.props.dispatch(addTransaction(transaction));

    this.props.dispatch(fetchQuotes());
    if (this.props.onSubmit) this.props.onSubmit(transaction);
    if (this.formRef != null) this.formRef.reset();
  };

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <Form
            action="/api"
            method="post"
            onSubmit={this.handleSubmit}
            innerRef={ref => {
              this.formRef = ref;
            }}>
            <FormGroup>
              <Label for="ticker">Symbol</Label>
              <Input autoComplete="off" id="ticker" name="ticker" required />
            </FormGroup>
            {this.state.showTransactionData ? (
              <FormGroup>
                <Button
                  color="link"
                  onClick={this.handleHideTransactionData}
                  size="sm"
                  type="button">
                  - Remove transaction data
                </Button>
              </FormGroup>
            ) : (
              <FormGroup>
                <Button
                  color="link"
                  onClick={this.handleShowTransactionData}
                  size="sm"
                  type="button">
                  + Add transaction data
                </Button>
              </FormGroup>
            )}
            <Collapse isOpen={this.state.showTransactionData}>
              <FormGroup>
                <Label for="type">Type</Label>
                <select
                  className="form-control"
                  disabled={!this.state.showTransactionData}
                  id="type"
                  name="type"
                  required>
                  <option>Buy</option>
                  <option>Sell</option>
                </select>
              </FormGroup>
              <FormGroup>
                <Label for="date">Date</Label>
                <Input
                  disabled={!this.state.showTransactionData}
                  id="date"
                  name="date"
                  type="date"
                />
              </FormGroup>
              <FormGroup>
                <Label for="shares">Shares</Label>
                <Input
                  disabled={!this.state.showTransactionData}
                  id="shares"
                  min="0"
                  name="shares"
                  required
                  step=".001"
                  type="number"
                />
              </FormGroup>
              <FormGroup>
                <Label for="price">Price/Amount</Label>
                <Input
                  disabled={!this.state.showTransactionData}
                  id="price"
                  min="0"
                  name="price"
                  step=".01"
                  type="number"
                />
              </FormGroup>
              <FormGroup>
                <Label for="commission">Commission</Label>
                <Input
                  disabled={!this.state.showTransactionData}
                  id="commission"
                  min="0"
                  name="commission"
                  step=".01"
                  type="number"
                />
              </FormGroup>
            </Collapse>
            <FormGroup style={{ marginBottom: 0 }}>
              <Button color="primary" disabled={this.props.isLoading} type="submit">
                Add to portfolio
              </Button>
            </FormGroup>
          </Form>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  isLoading: state.isFetchingQuotes,
}))(AddSymbolForm);
