/* @flow */

import './SpinKit.css';
import * as React from 'react';

type Props = {
  title: ?string,
  type: 'folding-cube',
};

export default function SpinKit(props: Props) {
  return (
    <div className="sk-folding-cube mr-3" title={props.title}>
      <div className="sk-cube1 sk-cube" />
      <div className="sk-cube2 sk-cube" />
      <div className="sk-cube4 sk-cube" />
      <div className="sk-cube3 sk-cube" />
    </div>
  );
}
