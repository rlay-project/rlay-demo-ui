// @flow
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
import Select from 'react-select';
import {
  uniq,
  isNull,
} from 'lodash-es';

class AddAnnotationForm extends React.Component {
  static defaultProps = {
    ontologyAnnotationProperties: [],
    resetCounter: 0,
    onAnnotationChange: () => {},
    onValidate: () => {},
  }

  static defaultState = {
    valueValue: '',
    valueProperty: null,
  }

  state = {
    valueValue: '',
    valueProperty: null,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.resetCounter != nextProps.resetCounter) {
      this.setState(AddAnnotationForm.defaultState,
        () => this.handleAnnotationChange());
    }
  }

  handleValueValueChange = (e) => {
    this.setState({
      valueValue: e.target.value,
    }, () => this.handleAnnotationChange());
  }

  handlePropertySelectChange = (selectedOptions) => {
    this.setState({ valueProperty: selectedOptions },
      () => this.handleAnnotationChange());
  }

  buildAnnotation = () => {
    return {
      property: this.state.valueProperty ? this.state.valueProperty.hash : null,
      value: this.state.valueValue,
    };
  };

  handleAnnotationChange = () => {
    this.props.onAnnotationChange(this.buildAnnotation());
    this.props.onValidate(this.validate());
  }

  validate = () => {
    if (!this.state.valueProperty) {
      return false;
    }
    if (this.state.valueValue === '') {
      return false;
    }
    return true;
  }

  render() {
    const { ontologyAnnotationProperties } = this.props;

    const classOptions = ontologyAnnotationProperties.map(n => ({
      ...n,
      label: `${n.hash} (${n.value})`,
    }));

    return (
      <Form>
        <FormGroup>
          <Select
            options={classOptions}
            multi={false}
            labelKey="label"
            value={this.state.valueProperty}
            onChange={this.handlePropertySelectChange}
            isOptionUnique={() => true}
            placeholder="Select AnnotationProperty..."
          />
        </FormGroup>
        <FormGroup>
          <InputGroup style={{ marginBottom: '10px' }}>
            <Input
              placeholder="Value"
              value={this.state.valueValue}
              onChange={this.handleValueValueChange}
            />
          </InputGroup>
        </FormGroup>
      </Form>
    );
  }
}

class AddAnnotationContainer extends React.Component {
  static defaultProps = {
    ontologyAnnotationProperties: [],
    onSubmit: () => {},
  }

  static defaultState = {
    formAnnotation: null,
    formValid: false,
  }

  state = {
    formAnnotation: null,
    formValid: false,
    resetCounter: 0,
  }

  handleSubmitClick = () => {
    const { ontologyAnnotationProperties } = this.props;

    this.props.onSubmit(this.state.formAnnotation);
    this.setState({
      ...AddAnnotationContainer.defaultState,
      resetCounter: this.state.resetCounter + 1,
    });
  }

  handleFormAnnotationChange = (formAnnotation) => {
    this.setState({ formAnnotation });
  }

  handleFormValidate = (valid) => {
    this.setState({ formValid: valid });
  }

  render() {
    return (
      <span className="border rounded" style={{ marginLeft: '20px', padding: '20px', display: 'block', width: '100%', height: '100%' }}>
        <h3>Add Annotation</h3>
        <AddAnnotationForm
          ontologyAnnotationProperties={this.props.ontologyAnnotationProperties}
          onAnnotationChange={this.handleFormAnnotationChange}
          onValidate={this.handleFormValidate}
          resetCounter={this.state.resetCounter}
        />
        <Button color="primary" onClick={this.handleSubmitClick} disabled={!this.state.formValid}>Submit</Button>{' '}
      </span>
    );
  }
}

module.exports = {
  AddAnnotationForm,
  AddAnnotationContainer,
};
