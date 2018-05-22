/* @flow */

import * as React from 'react';
import { Col, Container, Row } from 'reactstrap';
import AddSymbolForm from './AddSymbolForm';
import PortfolioNav from './PortfolioNav';

type Props = {
  children: React.Node,
};

export default function PortfolioContainer(props: Props) {
  return (
    <React.Fragment>
      <PortfolioNav />
      <Container className="mb-4">
        {props.children}
        <Row>
          <Col md="6">
            <AddSymbolForm />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}
