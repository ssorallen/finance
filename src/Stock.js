/* @flow */

import * as React from "react";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { Col, Container, Row } from "reactstrap";
import {
  abbreviatedNumberFormatter,
  currencyFormatter,
  numberFormatter,
  percentFormatter,
} from "./formatters";
import { deviation, extent, max, min } from "d3-array";
import { scaleTime, scaleLinear } from "@vx/scale";
import { useDispatch, useSelector } from "react-redux";
import { AreaClosed } from "@vx/shape";
import type { Dispatch } from "./types";
import { Group } from "@vx/group";
import { LinearGradient } from "@vx/gradient";
import cx from "classnames";
import { fetchSymbolData } from "./actions";

type Props = {
  match: Object,
};

const wholeNumberFormatter = new window.Intl.NumberFormat(undefined);

function SummaryListItem({ title, value }: { title: string, value: string }) {
  return (
    <li className="d-flex justify-content-between border-bottom py-2">
      <span>{title}</span>
      <strong>{value}</strong>
    </li>
  );
}

const width = 635;
const height = 400;
const x = (d) => new Date(d.date);
const y = (d) => d.close;

// Bounds
const margin = {
  top: 20,
  bottom: 40,
  left: 50,
  right: 0,
};
const xMax = width - margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;

export default function Stock({ match }: Props): React.Node {
  const dispatch = useDispatch<Dispatch>();
  const chart = useSelector((state) => state.charts[match.params.symbol]);
  const quote = useSelector((state) => state.quotes[match.params.symbol]);

  React.useEffect(() => {
    dispatch(fetchSymbolData(match.params.symbol));
  }, [dispatch, match.params.symbol]);

  let xScale;
  let yScale;
  if (chart != null) {
    const deviationYFudge = deviation(chart, y) / 2;
    xScale = scaleTime({
      range: [0, xMax],
      domain: extent(chart, x),
    });
    yScale = scaleLinear({
      range: [yMax, 0],
      domain: [min(chart, y) - deviationYFudge, max(chart, y) + deviationYFudge],
    });
  }
  return (
    <Container className="mb-3 mt-3">
      <h2>
        {quote == null ? "..." : quote.companyName} ({match.params.symbol})
      </h2>
      <h3>
        <small>{quote == null ? "..." : quote.latestPrice}</small>{" "}
        <span
          className={cx({
            "text-danger": quote != null && quote.change < 0,
            "text-success": quote != null && quote.change >= 0,
          })}
        >
          {quote == null
            ? "..."
            : `${quote.change >= 0 ? "+" : ""}${currencyFormatter.format(quote.change)} (${
                quote.changePercent >= 0 ? "+" : ""
              }${percentFormatter.format(quote.changePercent)})`}
        </span>
      </h3>
      <Row className="mt-4">
        <Col className="border-top border-top-lg pt-2" md="4">
          <h4 className="mb-3">Zusammenfassung</h4>
          <ul className="list-unstyled">
            <SummaryListItem
              title="Volumen"
              value={quote == null ? "..." : wholeNumberFormatter.format(quote.latestVolume)}
            />
            <SummaryListItem
              title="Avg Tägl. Volumen"
              value={quote == null ? "..." : wholeNumberFormatter.format(quote.avgTotalVolume)}
            />
            <SummaryListItem
              title="Schlusskurs"
              value={quote == null ? "..." : currencyFormatter.format(quote.previousClose)}
            />
            <SummaryListItem
              title="52-week Range"
              value={
                quote == null
                  ? "..."
                  : `${currencyFormatter.format(quote.week52Low)}–${currencyFormatter.format(
                      quote.week52High
                    )}`
              }
            />
            <SummaryListItem
              title="Mkt. Cap"
              value={quote == null ? "..." : abbreviatedNumberFormatter.format(quote.marketCap)}
            />
            <SummaryListItem
              title="P/E Ratio"
              value={
                quote == null || quote.peRatio == null
                  ? "..."
                  : numberFormatter.format(quote.peRatio)
              }
            />
          </ul>
        </Col>
        <Col className="border-top border-top-lg pt-2" md={{ offset: 1, size: 7 }}>
          <h4 className="mb-3">Historie</h4>
          {chart == null ? (
            <div
              className="text-center"
              style={{
                backgroundColor: "#343a40",
                borderRadius: "0.25rem",
                color: "#fff",
                height: `${height}px`,
                lineHeight: `${height}px`,
              }}
            >
              Laden...
            </div>
          ) : (
            <svg width={width} height={height}>
              <rect x={0} y={0} width={width} height={height} fill="#343a40" rx={"0.25rem"} />
              <LinearGradient id="gradient">
                <stop offset="0%" stopColor="#ffc107" stopOpacity={1} />
                <stop offset="100%" stopColor="#ffc107" stopOpacity={0.2} />
              </LinearGradient>
              <Group top={margin.top} left={margin.left}>
                <AreaClosed
                  data={chart}
                  xScale={xScale}
                  yScale={yScale}
                  x={x}
                  y={y}
                  fill={"url(#gradient)"}
                  stroke={""}
                />
                <AxisLeft
                  left={0}
                  scale={yScale}
                  stroke={"rgba(255,255,255,0.3)"}
                  top={0}
                  tickLabelProps={(val, i) => ({
                    dx: "-0.25em",
                    dy: "0.25em",
                    textAnchor: "end",
                    fontFamily: "Arial",
                    fontSize: 10,
                    fill: "rgba(255,255,255,0.9)",
                  })}
                  tickStroke={"rgba(255,255,255,0.3)"}
                  tickTextFill={"rgba(255,255,255,0.3)"}
                />
                <AxisBottom
                  scale={xScale}
                  stroke={"rgba(255,255,255,0.3)"}
                  top={yMax}
                  tickLabelProps={(val, i) => ({
                    dy: "0.25em",
                    textAnchor: "middle",
                    fontFamily: "Arial",
                    fontSize: 10,
                    fill: "rgba(255,255,255,0.9)",
                  })}
                  tickStroke={"rgba(255,255,255,0.3)"}
                  tickTextFill={"rgba(255,255,255,0.3)"}
                />
              </Group>
            </svg>
          )}
        </Col>
      </Row>
    </Container>
  );
}
