/* @flow */

import * as React from 'react';
import { Button, Col, Input, Label } from 'reactstrap';
import type { Transaction } from './reducers';
import { connect } from 'react-redux';
import csvParse from 'csv-parse/lib/sync';
import { addTransactions, deletePortfolio, fetchQuotes } from './actions';

type StateProps = {
  dispatch: Function,
};

type Props = StateProps;

type State = {
  isReadingFile: boolean,
};

type GfTransaction = {
  'Cash value': string,
  Commission: string,
  Date: string,
  Name: string,
  Notes: string,
  Price: string,
  Shares: string,
  Symbol: string,
  Type: 'Buy' | 'Sell',
};

function transformGfToStocks(gfTransactions: Array<GfTransaction>): Array<Transaction> {
  return gfTransactions.map(transaction => ({
    commission: parseFloat(transaction.Commission),
    date: transaction.Date,
    notes: transaction.Notes,
    price: parseFloat(transaction.Price),
    shares: parseFloat(transaction.Shares),
    symbol: transaction.Symbol,
    type: transaction.Type,
  }));
}

class PortfolioActions extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { isReadingFile: false };
  }

  handleDeletePortfolio = () => {
    this.props.dispatch(deletePortfolio());
  };

  handleImportTransactions = (event: SyntheticEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files == null || files.length === 0) return;

    const file = files[0];
    this.setState({ isReadingFile: true }, () => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const parsedCsv = csvParse(fileReader.result, { columns: true });
        this.props.dispatch(addTransactions(transformGfToStocks(parsedCsv)));
        this.props.dispatch(fetchQuotes());
        this.setState({ isReadingFile: false });
      };
      fileReader.readAsText(file);
    });
  };

  render() {
    return (
      <Col className="text-right">
        <Button color="link" disabled={this.state.isReadingFile} size="sm" type="button">
          <Label className="label-button">
            <Input accept="text/csv" hidden onChange={this.handleImportTransactions} type="file" />
            Import transactions
          </Label>
        </Button>
        |
        <Button color="link" onClick={this.handleDeletePortfolio} size="sm" type="button">
          Delete portfolio
        </Button>
      </Col>
    );
  }
}

export default connect()(PortfolioActions);
