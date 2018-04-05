import React from 'react';

export default class TruthTable extends React.Component {
  render() {
    const { tt } = this.props;

    return (
      <table class="table table-bordered">
        <thead>
          { tt[0].key.map((vari, i) => (
              <td key={i}><b>{vari.variable.toString()}</b></td>
            )) }
          <td><b>Value</b></td>
        </thead>
        <tbody>
        { tt.map((entry, i) => (
          <tr key={i}>
            { entry.key.map((vari, i) => (
              <td key={i}>{vari.value.toString()}</td>
            )) }
            <td>{entry.value}</td>
          </tr>
        )) }
        </tbody>
      </table>
    );
  }
}

