import React, {Component} from "react";
import {Table} from "reactstrap";

export default class PerformanceStats extends Component {

    constructor(props) {
        super(props);
        this.state = {
            marketValueTotal: props.marketValueTotal,
            fcraktien: 0,
            depotjulius: 0,
            darlehen: 0,
            kontostand: 0,
            dividende_2020: 0,
            dividende_2019: 0,
            geldtransfer_2020: 0,
            geldtransfer_2019: 0,
            zwischensumme: 0,
            liquidationssaldo: 0,
            ergebnis: 0
        }

        this.__handleFieldChange = this.__handleFieldChange.bind(this);
    }

    __handleFieldChange(event) {
        //simple data fields
        this.setState({
            [event.target.name]: event.target.value
        }, () => {
            this.setState({
                zwischensumme:
                    (this.state.marketValueTotal - this.state.darlehen).toFixed(2),
                liquidationssaldo:
                    (parseFloat(this.state.kontostand) + parseFloat(this.state.zwischensumme)).toFixed(2),
                ergebnis: (this.state.liquidationssaldo - this.state.dividende_2020 - this.state.dividende_2019 - this.state.geldtransfer_2020 - this.state.geldtransfer_2019).toFixed(2),
                depotjulius: (this.state.marketValueTotal - this.state.fcraktien).toFixed(2),


            })
        })

        // formulas

    }


    render() {
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-body">
                        <Table>
                            <tbody>
                            <h4>Depot</h4>
                            <tr>
                                <td>FCR Aktien</td>
                                <td><input type="number" className="form-text" onChange={this.__handleFieldChange}
                                           name={"fcraktien"}/></td>
                            </tr>
                            <tr>
                                <td>Depot Julius Bär</td>
                                <td>{this.state.depotjulius}</td>
                            </tr>
                            <h4>Liquidation</h4>
                            <tr>
                                <td>Darlehen</td>
                                <td><input type="number" className="form-text" onChange={this.__handleFieldChange}
                                           name={"darlehen"}/></td>
                            </tr>
                            <tr>
                                <td>Zwischensumme:</td>
                                <td>{this.state.zwischensumme}</td>
                            </tr>
                            <tr>
                                <td>Kontostand:</td>
                                <td><input type="number" className="form-text" onChange={this.__handleFieldChange}
                                           name={"kontostand"}/></td>
                            </tr>
                            <tr>
                                <td>Liquidationssaldo:</td>
                                <td>{this.state.liquidationssaldo}</td>
                            </tr>
                            <tr>
                                <td>Dividende 2020:</td>
                                <td><input type="number" className="form-text" onChange={this.__handleFieldChange}
                                           name={"dividende_2020"}/></td>
                            </tr>
                            <tr>
                                <td>Dividende 2019</td>
                                <td><input type="number" className="form-text" onChange={this.__handleFieldChange}
                                           name={"dividende_2019"}/></td>
                            </tr>
                            <tr>
                                <td>Geldtransfer 2020</td>
                                <td><input type="number" className="form-text" onChange={this.__handleFieldChange}
                                           name={"geldtransfer_2020"}/></td>
                            </tr>
                            <tr>
                                <td>Geldtransfer 2019</td>
                                <td><input type="number" className="form-text" onChange={this.__handleFieldChange}
                                           name={"geldtransfer_2019"}/></td>
                            </tr>
                            <tr>
                                <td>Ergebnis:</td>
                                <td>{this.state.ergebnis}</td>
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