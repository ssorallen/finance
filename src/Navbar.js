/* @flow */

import './Navbar.css';
import * as React from 'react';
import { Collapse, Form, Navbar as ReactstrapNavbar, NavbarBrand, NavbarToggler } from 'reactstrap';
import type { Dispatch, IEXSymbol } from './Types';
import { NavLink, type RouterHistory, withRouter } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import SpinKit from './SpinKit';
import { connect } from 'react-redux';
import cx from 'classnames';
import { fetchAllIexSymbols } from './actions';

type RouterProps = {
  history: RouterHistory,
};

type StateProps = {
  allIexSymbols: ?Array<IEXSymbol>,
  fetchErrorMessage: ?string,
  isLoading: boolean,
  updatedAt: ?number,
};

type ConnectProps = StateProps & { dispatch: Dispatch };

type Props = RouterProps & ConnectProps;

type State = {
  isOpen: boolean,
  searchIsFocused: boolean,
  searchQuery: string,
  searchResults: Array<IEXSymbol>,
};

const updatedAtFormatter = new window.Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  hour: 'numeric',
  hour12: false,
  minute: 'numeric',
  month: 'numeric',
  second: 'numeric',
  year: 'numeric',
});

function findFirstNSymbols(n: number, collection: Array<IEXSymbol>, search: string) {
  // Symbols are always uppercase, ensure uppercase to match.
  const uppercaseSearch = search.toUpperCase();
  const results: Array<IEXSymbol> = [];
  collection.some(iexSymbol => {
    if (iexSymbol.symbol.startsWith(uppercaseSearch)) {
      results.push(iexSymbol);
      if (results.length === n) return true;
    }
    return false;
  });
  return results;
}

function noop() {}

function Suggestion(suggestion: IEXSymbol, { query }: { query: string }) {
  // This is a simple prefix search (see `findFirstNSymbols`), so the starting index to highlight
  // is assumed to be 0.
  const highlightedSlice = suggestion.symbol.slice(0, query.length);
  const normalSlice = suggestion.symbol.slice(query.length);
  return (
    <span>
      <strong>{highlightedSlice}</strong>
      <span>{normalSlice}</span> - {suggestion.name}
    </span>
  );
}

function SuggestionValue(suggestion: IEXSymbol) {
  return suggestion.symbol;
}

class Navbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false,
      searchIsFocused: false,
      searchQuery: '',
      searchResults: [],
    };
  }

  handleSearchBlur = () => {
    this.setState({ searchIsFocused: false });
  };

  handleSearchFocus = () => {
    if (this.props.allIexSymbols == null) {
      this.props.dispatch(fetchAllIexSymbols());
    }
    this.setState({ searchIsFocused: true });
  };

  handleSearchQueryChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    if (event.currentTarget.nodeName !== 'INPUT') return;
    this.setSearchQuery(event.currentTarget.value);
  };

  handleSearchQueryClear = () => {
    this.setSearchQuery('');
  };

  handleSearchSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  handleSuggestionSelected = (event, { suggestionValue }) => {
    this.props.history.push(`/stocks/${suggestionValue}`);
  };

  setSearchQuery(nextSearchQuery: string) {
    this.setState({
      searchQuery: nextSearchQuery,
      searchResults:
        this.props.allIexSymbols == null
          ? []
          : findFirstNSymbols(5, this.props.allIexSymbols, nextSearchQuery),
    });
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    // Create local references to enable Flow refinement beyond `null | undefined`.
    const { fetchErrorMessage, updatedAt } = this.props;
    return (
      <ReactstrapNavbar color="dark" dark expand="md">
        <NavbarBrand className="text-warning" tag={NavLink} to="/">
          Finance!
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Form
            action="/finance/stocks"
            className="mr-auto"
            inline
            onSubmit={this.handleSearchSubmit}>
            <Autosuggest
              getSuggestionValue={SuggestionValue}
              highlightFirstSuggestion
              inputProps={{
                name: 'symbol',
                onBlur: this.handleSearchBlur,
                onChange: this.handleSearchQueryChange,
                onFocus: this.handleSearchFocus,
                placeholder: 'Search...',
                value: this.state.searchQuery,
              }}
              onSuggestionsClearRequested={this.handleSearchQueryClear}
              onSuggestionsFetchRequested={noop}
              onSuggestionSelected={this.handleSuggestionSelected}
              renderSuggestion={Suggestion}
              suggestions={this.state.searchResults}
              theme={{
                container: 'autosuggest',
                input: cx('dark-transition form-control', {
                  'bg-dark': !this.state.searchIsFocused,
                }),
                suggestionsContainer: 'dropdown',
                suggestionsList: `dropdown-menu ${
                  this.state.searchResults.length > 0 ? 'show' : ''
                }`,
                suggestion: 'dropdown-item',
                suggestionHighlighted: 'active',
              }}
            />
          </Form>
          {this.props.isLoading ? (
            <SpinKit title="Fetching new quotes..." type="folding-cube" />
          ) : null}
          {fetchErrorMessage == null ? null : (
            <abbr className="mr-1" title={`Error: ${fetchErrorMessage}`}>
              <span aria-label="Connection error" role="img">
                ⚠️
              </span>
            </abbr>
          )}
          <small>
            <span className="text-white-50">Quotes last fetched: </span>
            {updatedAt == null ? (
              <span className="text-white">never</span>
            ) : (
              <time className="text-white" dateTime={new Date(updatedAt).toISOString()}>
                {updatedAtFormatter.format(updatedAt)}
              </time>
            )}
          </small>
        </Collapse>
      </ReactstrapNavbar>
    );
  }
}

export default withRouter<Navbar>(
  connect<ConnectProps, {}, _, _, _, _>(state => ({
    allIexSymbols: state.allIexSymbols,
    fetchErrorMessage: state.fetchErrorMessage,
    isLoading: state.isFetchingCount > 0,
    updatedAt: state.updatedAt,
  }))(Navbar)
);
