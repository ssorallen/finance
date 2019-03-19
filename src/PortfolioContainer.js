/* @flow */

import * as React from 'react';
import { Col, Container, Row } from 'reactstrap';
import AddSymbolForm from './AddSymbolForm';
import type { Dispatch } from './types';
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
  render() {
    return (
      <>
        <PortfolioNav />
        <Container className="mb-4">
          {this.props.children}
          <Row>
            <Col md="6">
              <AddSymbolForm isLoading={this.props.isLoading} />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default connect<Props, OwnProps, _, _, _, _>(state => ({
  isLoading: state.isFetchingCount > 0,
}))(PortfolioContainer);
