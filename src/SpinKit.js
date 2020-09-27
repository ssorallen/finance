/* @flow */

import "./SpinKit.css";
import * as React from "react";
import cx from "classnames";

type Props = {
  className?: string,
  title?: string,
  type: "folding-cube",
};

export default function SpinKit(props: Props): React.Node {
  return (
    <div className={cx("sk-folding-cube-wrapper", props.className)}>
      <div className="sk-folding-cube" title={props.title}>
        <div className="sk-cube1 sk-cube" />
        <div className="sk-cube2 sk-cube" />
        <div className="sk-cube4 sk-cube" />
        <div className="sk-cube3 sk-cube" />
      </div>
    </div>
  );
}
