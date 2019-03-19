/* @flow */

import * as React from 'react';
import { Button, Col, Input, Label } from 'reactstrap';
import type { Dispatch } from './types';
import { deletePortfolio, downloadPortfolio, importTransactionsFile } from './actions';
import { connect } from 'react-redux';

type Props = { dispatch: Dispatch };

class PortfolioActions extends React.Component<Props> {
  handleDeletePortfolio = () => {
    if (
      window.confirm('Are you sure you want to delete the entire portfolio? This is irreversible.')
    ) {
      this.props.dispatch(deletePortfolio());
    }
  };

  handleDownloadPortfolio = () => {
    this.props.dispatch(downloadPortfolio());
  };

  handleImportTransactions = (event: SyntheticEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;
    const files = currentTarget.files;
    if (files == null || files.length === 0) return;
    this.props.dispatch(importTransactionsFile(files[0]));

    // Reset the input so the same file can be uploaded multiple times in a row (without
    // resetting the `onchange` would not fire). Why upload multiple times? Testing testing
    // testing. ABT: Always Be Testing.
    currentTarget.value = '';
  };

  render() {
    return (
      <Col className="text-right">
        <Button color="link" size="sm" type="button">
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

export default connect<Props, {}, _, _, _, _>()(PortfolioActions);
