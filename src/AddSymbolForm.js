/* @flow */

import * as React from "react";
import {Button, Col, Collapse, Form, FormGroup, Input, Label, Row} from "reactstrap";
import formSerialize from "form-serialize";
import {useEffect} from "react";

type Props = {
  isLoading: boolean,
  onAddSymbol?: (formData: Object) => void,
};

export default function AddSymbolForm(props: Props): React.Node {
  const [showTransactionData, setShowTransactionData] = React.useState(false);
  const [exchanges, setExchanges] = React.useState([]);

  useEffect(()=>{
    fetch("https://cloud.iexapis.com/v1/ref-data/exchanges?token="+JSON.parse(localStorage['default'])['iexApiKey'])
        .then(res => res.json())
        .then(
            (result) => {
              setExchanges(result);
            }
        )
  },[])

  const formEl = React.useRef(null);

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = formSerialize(event.currentTarget, { hash: true });
    if (props.onAddSymbol) props.onAddSymbol(formData);
    if (formEl.current != null) formEl.current.reset();
  }

  const _options = () =>{
    return exchanges.map(( item, index) => {
      return <option value={item.exchangeSuffix} key={index}>{item.description + ' (' + item.mic + ')'}</option>
    })
  }

  return (
    <div className="card">
      <div className="card-body">
        <Form action="/api" method="post" onSubmit={handleSubmit} innerRef={formEl}>
          <Row>
            <Col sm={6} xs={12}>
              <FormGroup>
                <Label for="symbol">Symbol</Label>
                <Input autoComplete="off" bsSize="sm" id="symbol" name="symbol" required />
              </FormGroup>
            </Col>
            <Col sm={6} xs={12}>
              <FormGroup>
                <Label for='ex-suffix'>Stock Exchange</Label>
                <Input type="select" name="exSuffix" bsSize="sm" id="exSuffix" required>
                  <option value=''>All Stock Exchanges</option>
                  {_options()}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          {showTransactionData ? (
            <FormGroup>
              <Button
                color="link"
                onClick={() => {
                  setShowTransactionData(false);
                }}
                size="sm"
                type="button"
              >
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
                type="button"
              >
                + Transaktionsdaten hinzufügen
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
                type="select"
              >
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
              <Label for="price">Kaufpreis/Stück</Label>
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
              Zu Portfolio hinzufügen
            </Button>
          </FormGroup>
        </Form>
      </div>
    </div>
  );
}
