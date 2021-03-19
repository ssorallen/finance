import React, {Component} from "react";
import {Table} from "reactstrap";

export default class PerformanceStats extends Component {

    render() {
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-body">

                        <Table>
                            <tbody>
                            <tr>
                                <td>Datum</td>
                                <td>19/02/2021</td>

                            </tr>
                            <tr>
                                <td>Depot Julius Bär</td>
                                <td>2,162,913.10 €</td>
                            </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
                <br/>
                <div className="card">
                    <div className="card-body">
                        <Table>
                            <tbody>
                            <tr>
                                <td>- Darlehen</td>
                                <td>1,810,000.00 €</td>
                            </tr>
                            <tr>
                                <td>Zwischensumme:</td>
                                <td>352,913.10 €</td>
                            </tr>
                            <tr>
                                <td>Kontostand::</td>
                                <td>131,301.66 €</td>
                            </tr>
                            <tr>
                                <td>Liquidationssaldo:</td>
                                <td>484,214.76 €</td>
                            </tr>
                            <tr>
                                <td>- Dividende 2020:</td>
                                <td>310,550.00 €</td>
                            </tr>
                            <tr>
                                <td>- Dividende 2019</td>
                                <td>71,450.00 €</td>
                            </tr>
                            <tr>
                                <td>- Geldtransfer 2020</td>
                                <td>126,500.00 €</td>
                            </tr>
                            <tr>
                                <td>- Geldtransfer 2019</td>
                                <td>100,000.00 €</td>
                            </tr>
                            <tr>
                                <td>Ergebnis:</td>
                                <td>-124,285.24 €</td>
                            </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
                <br/>
            </React.Fragment>
        );
    }

}