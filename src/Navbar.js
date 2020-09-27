/* @flow */

import "./Navbar.css";
import * as React from "react";
import {
  Button,
  Collapse,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  Navbar as ReactstrapNavbar,
  NavbarBrand,
  NavbarToggler,
} from "reactstrap";
import type { Dispatch, IEXSymbol } from "./Types";
import { NavLink, type RouterHistory, withRouter } from "react-router-dom";
import { fetchAllIexSymbols, setIexApiKey } from "./actions";
import Autosuggest from "react-autosuggest";
import SpinKit from "./SpinKit";
import { connect } from "react-redux";
import cx from "classnames";

type RouterProps = {
  history: RouterHistory,
};

type StateProps = {
  allIexSymbols: ?Array<IEXSymbol>,
  fetchErrorMessage: ?string,
  iexApiKey: ?string,
  isLoading: boolean,
  updatedAt: ?number,
};

type ConnectProps = StateProps & { dispatch: Dispatch };

type Props = RouterProps & ConnectProps;

type State = {
  activeModal: ?{ type: "settings" },
  isOpen: boolean,
  nextIexApiKey: string,
  searchIsFocused: boolean,
  searchQuery: string,
  searchResults: Array<IEXSymbol>,
};

const updatedAtFormatter = new window.Intl.DateTimeFormat(undefined, {
  day: "numeric",
  hour: "numeric",
  hour12: false,
  minute: "numeric",
  month: "numeric",
  second: "numeric",
  year: "numeric",
});

function findFirstNSymbols(n: number, collection: Array<IEXSymbol>, search: string) {
  // Symbols are always uppercase, ensure uppercase to match.
  const uppercaseSearch = search.toUpperCase();
  const results: Array<IEXSymbol> = [];
  collection.some((iexSymbol) => {
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
      activeModal: null,
      isOpen: false,
      nextIexApiKey: "",
      searchIsFocused: false,
      searchQuery: "",
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
    if (event.currentTarget.nodeName !== "INPUT") return;
    this.setSearchQuery(event.currentTarget.value);
  };

  handleSearchQueryClear = () => {
    this.setSearchQuery("");
  };

  handleSearchSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  handleSetIexApiKey = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.dispatch(setIexApiKey(this.state.nextIexApiKey));
    this.closeActiveModal();
  };

  handleSuggestionSelected = (event: Event, { suggestionValue }: { suggestionValue: string }) => {
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

  closeActiveModal = () => {
    this.setState({ activeModal: null });
  };

  openSettingsModal = () => {
    this.setState({
      activeModal: { type: "settings" },
      nextIexApiKey: this.props.iexApiKey == null ? "" : this.props.iexApiKey,
    });
  };

  setNextIexApiKey = (event) => {
    this.setState({ nextIexApiKey: event.target.value });
  };

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
            onSubmit={this.handleSearchSubmit}
          >
            <Autosuggest
              getSuggestionValue={SuggestionValue}
              highlightFirstSuggestion
              inputProps={{
                name: "symbol",
                onBlur: this.handleSearchBlur,
                onChange: this.handleSearchQueryChange,
                onFocus: this.handleSearchFocus,
                placeholder: "Search...",
                value: this.state.searchQuery,
              }}
              onSuggestionsClearRequested={this.handleSearchQueryClear}
              onSuggestionsFetchRequested={noop}
              onSuggestionSelected={this.handleSuggestionSelected}
              renderSuggestion={Suggestion}
              suggestions={this.state.searchResults}
              theme={{
                container: "autosuggest",
                input: cx("dark-transition form-control", {
                  "bg-dark": !this.state.searchIsFocused,
                }),
                suggestionsContainer: "dropdown",
                suggestionsList: `dropdown-menu ${
                  this.state.searchResults.length > 0 ? "show" : ""
                }`,
                suggestion: "dropdown-item",
                suggestionHighlighted: "active",
              }}
            />
          </Form>
          {this.props.isLoading ? (
            <SpinKit title="Fetching new quotes..." type="folding-cube" />
          ) : null}
          {fetchErrorMessage == null ? null : (
            <abbr className="mr-1" title={`Error: ${fetchErrorMessage}`}>
              <span aria-label="Connection error" className="text-danger" role="img">
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
          <Button className="ml-2" onClick={this.openSettingsModal} size="sm">
            Settings
          </Button>
        </Collapse>
        <Modal
          isOpen={this.state.activeModal != null && this.state.activeModal.type === "settings"}
          toggle={this.closeActiveModal}
        >
          <form onSubmit={this.handleSetIexApiKey}>
            <ModalBody>
              <div className="form-group">
                <label htmlFor="apiKey">IEX Publishable API Key</label>
                <input
                  className="form-control"
                  id="apiKey"
                  name="apiKey"
                  onChange={this.setNextIexApiKey}
                  placeholder="pk_abc123…"
                  value={this.state.nextIexApiKey}
                  required
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.closeActiveModal} outline type="button">
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Save
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      </ReactstrapNavbar>
    );
  }
}

// $FlowFixMe: stop using these HOC, switch to hooks
export default (withRouter<Navbar>(
  connect<ConnectProps, {}, _, _, _, _>((state) => ({
    allIexSymbols: state.allIexSymbols,
    fetchErrorMessage: state.fetchErrorMessage,
    iexApiKey: state.iexApiKey,
    isLoading: state.isFetchingCount > 0,
    updatedAt: state.updatedAt,
  }))(Navbar)
): React.ComponentType<*>);
