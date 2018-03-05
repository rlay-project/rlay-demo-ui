import React from 'react';
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Form,
  FormGroup,
  FormFeedback,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import {
  uniq,
  isNull,
} from 'lodash-es';

import { compactProposition, enrichPropositionInference, explainProposition } from './helpers';

class AddPropositionModal extends React.Component {
  static defaultProps = {
    isOpen: false,
    ontologyClasses: [],
    onChangeOpen: () => {},
    onSubmit: () => {},
  }

  static defaultState = {
    formProposition: null,
  }

  state = {
    formProposition: null,
    resetCounter: 0,
  }

  handleToggle = () => {
    this.props.onChangeOpen(!this.props.isOpen);
  }

  handleSubmitClick = () => {
    const { ontologyClasses } = this.props;

    const proposition = compactProposition(enrichPropositionInference(this.state.formProposition, ontologyClasses))
    this.props.onSubmit(proposition);
    this.setState({
      ...AddPropositionModal.defaultState,
      resetCounter: this.state.resetCounter + 1,
    });
    this.handleToggle();
  }

  handleFormPropositionChange = (formProposition) => {
    this.setState({ formProposition });
  }

  explanation = () => {
    const { ontologyClasses } = this.props;
    const { formProposition: plainProposition } = this.state;
    return explainProposition(plainProposition, ontologyClasses);
  }

  render() {
    const { isOpen } = this.props;
    const explanation = this.explanation();

    return (
      <Modal isOpen={isOpen} toggle={this.handleToggle} >
        <ModalHeader toggle={this.handleToggle}>Add proposition</ModalHeader>
        <ModalBody>
          <AddPropositionForm
            ontologyClasses={this.props.ontologyClasses}
            onPropositionChange={this.handleFormPropositionChange}
            resetCounter={this.state.resetCounter}
          />
        </ModalBody>
        { !isNull(explanation) ? (
          <ModalBody>
            <PropositionExplanation explanation={explanation} />
          </ModalBody>
        ) : null }
        <ModalFooter>
          <Button color="primary" onClick={this.handleSubmitClick}>Submit</Button>{' '}
        </ModalFooter>
      </Modal>
    );
  }
}

class AddPropositionContainer extends React.Component {
  static defaultProps = {
    ontologyClasses: [],
    onChangeOpen: () => {},
    onSubmit: () => {},
  }

  static defaultState = {
    formProposition: null,
    formValid: false,
  }

  state = {
    formProposition: null,
    formValid: false,
    resetCounter: 0,
  }

  handleSubmitClick = () => {
    const { ontologyClasses } = this.props;

    const proposition = compactProposition(enrichPropositionInference(this.state.formProposition, ontologyClasses))
    this.props.onSubmit(proposition);
    this.setState({
      ...AddPropositionModal.defaultState,
      resetCounter: this.state.resetCounter + 1,
    });
  }

  handleFormPropositionChange = (formProposition) => {
    this.setState({ formProposition });
  }

  handleFormValidate = (valid) => {
    this.setState({ formValid: valid });
  }

  explanation = () => {
    const { ontologyClasses } = this.props;
    const { formProposition: plainProposition } = this.state;
    return explainProposition(plainProposition, ontologyClasses);
  }

  render() {
    const explanation = this.explanation();

    return (
      <span className="border rounded" style={{ marginLeft: '20px', padding: '20px', display: 'block', width: '100%', height: '100%' }}>
        <h3>Add proposition</h3>
        <AddPropositionForm
          ontologyClasses={this.props.ontologyClasses}
          onPropositionChange={this.handleFormPropositionChange}
          onValidate={this.handleFormValidate}
          resetCounter={this.state.resetCounter}
        />
        { explanation ? (
          <ModalBody>
            <PropositionExplanation explanation={explanation} />
          </ModalBody>
        ) : null }
        <Button color="primary" onClick={this.handleSubmitClick} disabled={!this.state.formValid}>Submit</Button>{' '}
      </span>
    );
  }
}

class AddPropositionForm extends React.Component {
  static defaultProps = {
    ontologyClasses: [],
    resetCounter: 0,
    onPropositionChange: () => {},
    onValidate: () => {},
  }

  static defaultState = {
    valueLabel: '',
    valueClass: null,
    valueClasses: [],
  }

  state = {
    valueLabel: '',
    valueClass: null,
    valueClasses: [],
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.resetCounter != nextProps.resetCounter) {
      this.setState(AddPropositionForm.defaultState,
        () => this.handlePropositionChange());
    }
  }

  handleValueLabelChange = (e) => {
    this.setState({
      valueLabel: e.target.value,
    }, () => this.handlePropositionChange());
  }

  handleValueClassChange = (e) => {
    this.setState({
      valueClass: e.target.value,
    });
  }

  handleAddClassClick = () => {
    if (!this.validateClass()) {
      return;
    }

    this.setState({
      valueClasses: this.addClasses(
        this.state.valueClasses,
        [this.state.valueClass],
      ),
      valueClass: '',
    }, () => this.handlePropositionChange());
  }

  handleAddClassKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleAddClassClick();
    }
  }

  buildProposition = () => {
    return {
      label: this.state.valueLabel,
      class_memberships: this.state.valueClasses,
    };
  };

  handlePropositionChange = () => {
    this.props.onPropositionChange(this.buildProposition());
    this.props.onValidate(this.validate());
  }

  validate = () => {
    if (this.state.valueClasses.length === 0) {
      return false;
    }
    if (this.state.valueLabel === '') {
      return false;
    }
    return true;
  }

  validateClass = () => {
    if (this.state.valueClass === '') {
      return true;
    }

    const ontologyIds = this.props.ontologyClasses.map(n => n.id);
    if (ontologyIds.includes(this.state.valueClass)) {
      return true;
    }
    return false;
  }

  addClasses = (oldClasses, newClasses) => {
    return uniq([].concat(oldClasses, newClasses));
  }

  render() {
    const { ontologyClasses } = this.props;

    return (
      <Form>
        <FormGroup>
        <InputGroup style={{marginBottom: '10px'}}>
          <Input
            placeholder="Label for entity"
            value={this.state.valueLabel}
            onChange={this.handleValueLabelChange}
          />
        </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <select value={this.state.valueClass} className="custom-select" onChange={this.handleValueClassChange}>
              <option value={null}>Choose a class...</option>
              { ontologyClasses.map(klass => (
                <option value={klass.id}>{klass.id}</option>
              )) }
            </select>
            <InputGroupAddon addonType="append"><Button onClick={this.handleAddClassClick}>+</Button></InputGroupAddon>
            <FormFeedback>No class with that name found</FormFeedback>
          </InputGroup>
        </FormGroup>
      </Form>
    );
  }
}

class PropositionExplanation extends React.Component {
  render() {
    const { explanation } = this.props;

    return (
      <div>
        <b>Plaintext Explanation:</b>
        <ul>
          { explanation.asserted.map(expl => (
            <li>{expl}</li>
          )) }
        </ul>
        <b>Plaintext Explanation (inferred):</b>
        <ul>
          { explanation.inferred.map(expl => (
            <li>{expl}</li>
          )) }
        </ul>
      </div>
    );
  }
}

module.exports = {
  AddPropositionModal,
  AddPropositionContainer,
  AddPropositionForm,
  PropositionExplanation,
};
