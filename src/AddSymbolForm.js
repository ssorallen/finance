/* @flow */

import * as React from 'react';
import { Button, Collapse, Form, FormGroup, Input, Label } from 'reactstrap';
import formSerialize from 'form-serialize';

type Props = {
  isLoading: boolean,
  onAddSymbol?: (formData: Object) => void,
};

export default function AddSymbolForm(props: Props) {
  const [showTransactionData, setShowTransactionData] = React.useState(false);
  const formEl = React.useRef(null);

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = formSerialize(event.currentTarget, { hash: true });
    if (props.onAddSymbol) props.onAddSymbol(formData);
    if (formEl.current != null) formEl.current.reset();
  }

  return (
    <div className="card">
      <div className="card-body">
        <Form action="/api" method="post" onSubmit={handleSubmit} innerRef={formEl}>
          <FormGroup>
            <Label for="symbol">Symbol</Label>
            <Input autoComplete="off" bsSize="sm" id="symbol" name="symbol" required />
          </FormGroup>
          {showTransactionData ? (
            <FormGroup>
              <Button
                color="link"
                onClick={() => {
                  setShowTransactionData(false);
                }}
                size="sm"
                type="button">
                - Remove transaction data
              </Button>
            </FormGroup>
          ) : (
            <FormGroup>
              <Button
                color="link"
                onClick={() => {
                  setShowTransactionData(true);
                }}
                size="sm"
                type="button">
                + Add transaction data
              </Button>
            </FormGroup>
          )}
          <Collapse isOpen={showTransactionData}>
            <FormGroup>
              <Label for="type">Type</Label>
              <Input
                bsSize="sm"
                className="form-control"
                disabled={!showTransactionData}
                id="type"
                name="type"
                required
                type="select">
                <option>Buy</option>
                <option>Sell</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="shares">Shares</Label>
              <Input
                bsSize="sm"
                disabled={!showTransactionData}
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
                bsSize="sm"
                disabled={!showTransactionData}
                id="price"
                min="0"
                name="price"
                step=".01"
                type="number"
              />
            </FormGroup>
            <FormGroup>
              <Label for="date">
                Date <small className="text-secondary">(Optional)</small>
              </Label>
              <Input
                bsSize="sm"
                disabled={!showTransactionData}
                id="date"
                name="date"
                type="date"
              />
            </FormGroup>
            <FormGroup>
              <Label for="commission">
                Commission <small className="text-secondary">(Optional)</small>
              </Label>
              <Input
                bsSize="sm"
                disabled={!showTransactionData}
                id="commission"
                min="0"
                name="commission"
                step=".01"
                type="number"
              />
            </FormGroup>
          </Collapse>
          <FormGroup style={{ marginBottom: 0 }}>
            <Button color="primary" disabled={props.isLoading} size="sm" type="submit">
              Add to portfolio
            </Button>
          </FormGroup>
        </Form>
      </div>
    </div>
  );
}
