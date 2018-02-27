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

export default class AddPropositionModal extends React.Component {
  static defaultProps = {
    isOpen: false,
    ontologyClasses: [],
    onChangeOpen: () => {},
    onSubmit: () => {},
  }

  static defaultState = {
    valueLabel: '',
    valueClass: '',
    valueClasses: [],
  }

  state = {
    valueLabel: '',
    valueClass: '',
    valueClasses: [],
  }

  handleToggle = () => {
    this.props.onChangeOpen(!this.props.isOpen);
  }

  handleValueLabelChange = (e) => {
    this.setState({
      valueLabel: e.target.value,
    });
  }

  handleValueClassChange = (e) => {
    this.setState({
      valueClass: e.target.value,
    });
  }

  handleAddClassClick = () => {
    this.setState({
      valueClasses: [].concat(
        this.state.valueClasses,
        this.impliedClasses(this.state.valueClass),
      ),
      valueClass: '',
    });
  }

  handleSubmitClick = () => {
    const proposition = {
      label: this.state.valueLabel,
      class_memberships: this.state.valueClasses,
    };
    this.props.onSubmit(proposition);
    this.setState(AddPropositionModal.defaultState);
    this.handleToggle();
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

  impliedClasses = (concreteClass) => {
    const { ontologyClasses } = this.props;

    const parentClasses = (ontClass) => {
      let classes = [ontClass.id];
      if (ontClass.parents === []) {
        return classes;
      } else {
        ontClass.parents.forEach((parent) => {
          const parentOntClass = ontologyClasses.find(n => n.id === parent);
          const pClasses = parentClasses(parentOntClass);
          classes = [].concat(classes, pClasses);
        })
        return classes;
      }
    };

    const concreteOntClass = ontologyClasses.find(n => n.id === concreteClass);
    return parentClasses(concreteOntClass);
  }

  explanation = () => {
    let text = '';

    if (this.state.valueLabel !== '') {
      text = text + `- There is a entity named ${this.state.valueLabel}. (The name does not have any influence on the reasoning.)\n`;
    }
    this.state.valueClasses.forEach((klass) => {
      text = text + `- ${this.state.valueLabel} is a ${klass}\n`;
    });

    return text;
  }

  render() {
    const { isOpen } = this.props;
    return (
      <Modal isOpen={isOpen} toggle={this.handleToggle} >
        <ModalHeader toggle={this.handleToggle}>Add proposition</ModalHeader>
        <ModalBody>
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
              <Input
                placeholder="Name of class, e.g. 'ForProfit'"
                value={this.state.valueClass}
                onChange={this.handleValueClassChange}
                valid={this.validateClass()}
              />
              <InputGroupAddon addonType="append"><Button onClick={this.handleAddClassClick}>+</Button></InputGroupAddon>
              <FormFeedback>No class with that name found</FormFeedback>
            </InputGroup>
          </FormGroup>
      </Form>
        </ModalBody>
        <ModalBody>
          <b>Plaintext Explanation:</b>
          <p style={{ whiteSpace: 'pre-line' }}>
          {this.explanation()}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleSubmitClick}>Submit</Button>{' '}
        </ModalFooter>
      </Modal>
    );
  }
}

