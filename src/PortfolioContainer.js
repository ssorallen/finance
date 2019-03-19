/* @flow */

import * as React from 'react';
import type { AppState, Dispatch } from './types';
import { Col, Container, Row } from 'reactstrap';
import { addTransaction, fetchAllQuotes } from './actions';
import AddSymbolForm from './AddSymbolForm';
import PortfolioNav from './PortfolioNav';
import { connect } from 'react-redux';

type OwnProps = {
  children?: React.Node,
};

type StateProps = {
  isLoading: boolean,
};

type Props = OwnProps & StateProps & { dispatch: Dispatch };

class PortfolioContainer extends React.Component<Props> {
  handleAddSymbol = (data: {
    commission: string,
    date: string,
    price: string,
    shares: string,
    symbol: string,
    type: 'Buy' | 'Sell',
  }) => {
    // Set some defaults and override the symbol to make sure it's always UPPERCASE.
    const transaction = {
      cashValue: null,
      commission: parseFloat(data.commission) || 0,
      date: data.date,
      id: -1, // A real ID is added in the reducer.
      notes: null,
      price: parseFloat(data.price) || 0,
      shares: parseFloat(data.shares) || 0,
      symbol: data.symbol.toUpperCase(),
      type: data.type || 'Buy', // Match the behavior of Google Finance; 0 value is a 'Buy'.
    };

    this.props.dispatch(addTransaction(transaction));
    this.props.dispatch(fetchAllQuotes());
  };

  render() {
    return (
      <>
        <PortfolioNav />
        <Container className="mb-4">
          {this.props.children}
          <Row>
            <Col md="6">
              <AddSymbolForm isLoading={this.props.isLoading} onAddSymbol={this.handleAddSymbol} />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default connect<Props, OwnProps, _, _, _, _>((state: AppState) => ({
  isLoading: state.isFetchingCount > 0,
}))(PortfolioContainer);
