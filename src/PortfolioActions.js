/* @flow */

import * as React from 'react';
import { Button, Col, Input, Label } from 'reactstrap';
import { addTransactions, deletePortfolio, downloadPortfolio, fetchQuotes } from './actions';
import { connect } from 'react-redux';
import csvParse from 'csv-parse/lib/sync';
import { transformGfToStocks } from './transformers';

type StateProps = {
  dispatch: Function,
};

type Props = StateProps;

type State = {
  isReadingFile: boolean,
};

class PortfolioActions extends React.Component<Props, State> {
  fileReader: ?FileReader;

  constructor(props) {
    super(props);
    this.state = { isReadingFile: false };
  }

  componentWillUnmount() {
    // Ensure any in-flight file reading is killed if this component is about to be unmounted.
    if (this.fileReader != null) this.fileReader.onload = function() {};
  }

  handleDeletePortfolio = () => {
    this.props.dispatch(deletePortfolio());
  };

  handleDownloadPortfolio = () => {
    this.props.dispatch(downloadPortfolio());
  };

  handleImportTransactions = (event: SyntheticEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files == null || files.length === 0) return;

    const file = files[0];
    this.setState({ isReadingFile: true }, () => {
      const fileReader = (this.fileReader = new FileReader());
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
        |
        <Button color="link" onClick={this.handleDownloadPortfolio} size="sm" type="button">
          Download to spreadsheet
        </Button>
      </Col>
    );
  }
}

export default connect()(PortfolioActions);
