/* @flow */

import * as React from 'react';
import { Button, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { deletePortfolio } from './actions';

type StateProps = {
  dispatch: Function,
};

type Props = StateProps;

class PortfolioActions extends React.Component<Props> {
  handleDeletePortfolio = () => {
    this.props.dispatch(deletePortfolio());
  };

  render() {
    return (
      <Col className="text-right">
        <Button color="link" onClick={this.handleDeletePortfolio} size="sm">
          Delete portfolio
        </Button>
      </Col>
    );
  }
}

export default connect()(PortfolioActions);
