/* @flow */

import * as React from "react";
import type {AppState, Dispatch} from "./types";
import {Button, Col, Container, Row} from "reactstrap";
import {
    addTransaction,
    deletePortfolio,
    downloadPortfolio,
    fetchAllQuotes,
    importTransactionsFile,
} from "./actions";
import {useDispatch, useSelector} from "react-redux";
import AddSymbolForm from "./AddSymbolForm";
import PortfolioActions from "./PortfolioActions";
import PortfolioNav from "./PortfolioNav";
import PerformanceStats from "./PerformanceStats";

type Props = {
    children?: React.Node,
    deleteDisabled: boolean,
    onDelete: () => void,
};

export default function Portfolio({children, deleteDisabled, onDelete, marketValueTotal}: Props): React.Node {
    const dispatch = useDispatch<Dispatch>();
    const isLoading = useSelector<AppState, boolean>(state => state.isFetchingCount > 0);

    function handleAddSymbol(data: {
        commission: string,
        date: string,
        price: string,
        shares: string,
        symbol: string,
        exSuffix: string,
        type: "Buy" | "Sell",
    }) {
        // Set some defaults and override the symbol to make sure it's always UPPERCASE.
        const transaction = {
            cashValue: null,
            commission: parseFloat(data.commission) || 0,
            date: data.date,
            id: -1, // A real ID is added in the reducer.
            notes: null,
            price: parseFloat(data.price) || 0,
            shares: parseFloat(data.shares) || 0,
            symbol: data.symbol.toUpperCase() + data.exSuffix,
            exSuffix: data.exSuffix,
            type: data.type || "Buy", // Match the behavior of Google Finance; 0 value is a 'Buy'.
        };

        dispatch(addTransaction(transaction));
        dispatch(fetchAllQuotes());


    };

    function handleDeletePortfolio() {
        if (
            window.confirm("Are you sure you want to delete the entire portfolio? This is irreversible.")
        ) {
            dispatch(deletePortfolio());
        }
    };

    function handleDownloadPortfolio() {
        dispatch(downloadPortfolio());
    };

    function handleImportPortfolio(file: Blob) {
        dispatch(importTransactionsFile(file));
    };

    return (
        <>
            <PortfolioNav/>
            <Container fluid>
                <Row className="mb-3 mt-3">
                    <Col>
                        <Button
                            color={deleteDisabled ? "secondary" : "danger"}
                            disabled={deleteDisabled}
                            onClick={onDelete}
                            outline
                            size="sm"
                        >
                            Löschen
                        </Button>
                    </Col>
                    <PortfolioActions
                        onDeletePortfolio={handleDeletePortfolio}
                        onDownloadPortfolio={handleDownloadPortfolio}
                        onImportPortfolio={handleImportPortfolio}
                    />
                </Row>
                {children}
            </Container>
            <Container className="mb-4">
                <Row>
                    <Col md="6">
                        <PerformanceStats marketValueTotal={marketValueTotal}/>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <AddSymbolForm isLoading={isLoading} onAddSymbol={handleAddSymbol}/>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
