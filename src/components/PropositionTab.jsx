import React from 'react';

import NetworkMarginals from './NetworkMarginals.jsx';
import PropositionList from './PropositionList.jsx';
import {
  AddPropositionModal,
  AddPropositionContainer,
} from './AddPropositionModal.jsx';

export default class PropositionTab extends React.Component {
  static defaultProps = {
    ontologyClasses: [],
    ontologyIndividuals: [],

    onAddProposition: () => {},
    onDeleteProposition: () => {},
  };

  state = {
    addIndividualModalOpen: false,
  };

  render() {
    const { ontologyClasses, onAddProposition } = this.props;

    const containerStyle = {
      maxWidth: '1000px',
      margin: '20px',
      marginLeft: 'auto',
      marginRight: 'auto',
    };

    return (
      <div style={containerStyle}>
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <NetworkMarginals {...this.props} height={400} width={800} />
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '0.65' }}>
            <PropositionList {...this.props} />
          </div>
          <div style={{ flex: '0.35' }}>
            <AddPropositionContainer
              ontologyClasses={ontologyClasses}
              onSubmit={onAddProposition}
            />
          </div>
        </div>
        {
          <AddPropositionModal
            isOpen={this.state.addIndividualModalOpen}
            ontologyClasses={ontologyClasses}
            onChangeOpen={open =>
              this.setState({ addIndividualModalOpen: open })
            }
            onSubmit={onAddProposition}
          />
        }
      </div>
    );
  }
}
