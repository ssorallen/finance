/* @flow */

import * as React from 'react';
import { Button, Col, Row } from 'reactstrap';
import OverviewRow from './OverviewRow';
import { connect } from 'react-redux';
import { deleteSymbols } from './actions';

type StateProps = {
  dispatch: Function,
  symbols: Array<string>,
};

type Props = StateProps;

type State = {
  selectedSymbols: Set<string>,
};

class Performance extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      // This is *not* treated as immutable. Object identity will not always correctly indicate
      // when changes are made.
      selectedSymbols: new Set(),
    };
  }

  handleDeleteSelectedSymbols = () => {
    this.props.dispatch(deleteSymbols(Array.from(this.state.selectedSymbols)));
    this.setState({ selectedSymbols: new Set() });
  };

  handleToggleAllSymbols = () => {
    if (this.state.selectedSymbols.size < this.props.symbols.length) {
      this.setState({ selectedSymbols: new Set(this.props.symbols) });
    } else {
      this.setState({ selectedSymbols: new Set() });
    }
  };

  handleToggleSymbolSelected = (symbol: string) => {
    if (this.state.selectedSymbols.has(symbol)) {
      this.state.selectedSymbols.delete(symbol);
      this.forceUpdate();
    } else {
      this.state.selectedSymbols.add(symbol);
      this.forceUpdate();
    }
  };

  render() {
    const allSymbolsSelected =
      this.props.symbols.length > 0 && // They can only all be selected if there's at least 1.
      this.props.symbols.length === this.state.selectedSymbols.size;
    const deleteDisabled = this.props.symbols.length === 0 || this.state.selectedSymbols.size === 0;
    return (
      <React.Fragment>
        <Row className="mb-3 mt-3">
          <Col>
            <Button
              color={deleteDisabled ? 'secondary' : 'danger'}
              disabled={deleteDisabled}
              onClick={this.handleDeleteSelectedSymbols}
              outline
              size="sm">
              Delete
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 1 }}>
                    <input
                      checked={allSymbolsSelected}
                      disabled={this.props.symbols.length === 0}
                      onChange={this.handleToggleAllSymbols}
                      type="checkbox"
                    />
                  </th>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Last Price</th>
                  <th>Change</th>
                  <th>Market Cap</th>
                  <th>Open</th>
                  <th>Close</th>
                </tr>
              </thead>
              <tbody>
                {this.props.symbols.length === 0 ? (
                  <tr>
                    <td className="text-center" colSpan="8">
                      No symbols yet. Add one using the form below.
                    </td>
                  </tr>
                ) : (
                  this.props.symbols.map(symbol => (
                    <OverviewRow
                      key={symbol}
                      onToggleSelected={this.handleToggleSymbolSelected}
                      selected={this.state.selectedSymbols.has(symbol)}
                      symbol={symbol}
                    />
                  ))
                )}
              </tbody>
            </table>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default connect(state => ({
  symbols: state.symbols,
}))(Performance);
