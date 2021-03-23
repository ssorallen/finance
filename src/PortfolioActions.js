/* @flow */

import * as React from "react";
import { Button, Col, Input, Label } from "reactstrap";

type Props = {
  onDeletePortfolio: () => void,
  onDownloadPortfolio: () => void,
  onImportPortfolio: (file: Blob) => void,
};

export default function PortfolioActions(props: Props): React.Node {
  const handleImportTransactions = (event: SyntheticEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;
    const files = currentTarget.files;
    if (files == null || files.length === 0) return;
    props.onImportPortfolio(files[0]);

    // Reset the input so the same file can be uploaded multiple times in a row (without
    // resetting the `onchange` would not fire). Why upload multiple times? Testing testing
    // testing. ABT: Always Be Testing.
    currentTarget.value = "";
  };

  return (
    <Col className="text-right">
      <Button color="link" size="sm" type="button">
        <Label className="label-button">
          <Input accept="text/csv" hidden onChange={handleImportTransactions} type="file" />
          Transaktionen importieren
        </Label>
      </Button>
      |
      <Button color="link" onClick={props.onDeletePortfolio} size="sm" type="button">
        Portfolio löschen
      </Button>
      |
      <Button color="link" onClick={props.onDownloadPortfolio} size="sm" type="button">
        CSV Export
      </Button>
    </Col>
  );
}
