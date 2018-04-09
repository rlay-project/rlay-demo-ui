// @flow
import React from 'react';
import { Button, Input, InputGroup, Form, FormGroup } from 'reactstrap';
import Select from 'react-select';

import type { AnnotationProperty } from './AnnotationPropertyList.jsx';
import type { RsAnnotation } from '../types';

type AddAnnotationFormProps = {
  ontologyAnnotationProperties: Array<AnnotationProperty>,
  resetCounter: number,
  onAnnotationChange: (?RsAnnotation) => void,
  onValidate: boolean => void,
};

type AddAnnotationFormState = {
  valueValue: string,
  valueProperty: ?AnnotationProperty,
};

class AddAnnotationForm extends React.Component<
  AddAnnotationFormProps,
  AddAnnotationFormState,
> {
  static defaultProps = {
    ontologyAnnotationProperties: [],
    resetCounter: 0,
    onAnnotationChange: () => {},
    onValidate: () => {},
  };

  static defaultState = {
    valueValue: '',
    valueProperty: null,
  };

  state = {
    valueValue: '',
    valueProperty: null,
  };

  componentWillReceiveProps(nextProps: AddAnnotationFormProps) {
    if (this.props.resetCounter !== nextProps.resetCounter) {
      this.setState(AddAnnotationForm.defaultState, () =>
        this.handleAnnotationChange(),
      );
    }
  }

  handleValueValueChange = (e: any) => {
    this.setState(
      {
        valueValue: e.target.value,
      },
      () => this.handleAnnotationChange(),
    );
  };

  handlePropertySelectChange = (selectedOptions: any) => {
    this.setState({ valueProperty: selectedOptions }, () =>
      this.handleAnnotationChange(),
    );
  };

  buildAnnotation = () => {
    if (!this.state.valueProperty) {
      return null;
    }

    return {
      property: this.state.valueProperty.hash,
      value: this.state.valueValue,
    };
  };

  handleAnnotationChange = () => {
    this.props.onAnnotationChange(this.buildAnnotation());
    this.props.onValidate(this.validate());
  };

  validate = () => {
    if (!this.state.valueProperty) {
      return false;
    }
    if (this.state.valueValue === '') {
      return false;
    }
    return true;
  };

  render() {
    const { ontologyAnnotationProperties } = this.props;

    const classOptions = ontologyAnnotationProperties.map(n => ({
      ...n,
      label: `${(n.hash: any)} (${n.value})`,
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

type AddAnnotationContainerProps = {
  ontologyAnnotationProperties: Array<AnnotationProperty>,
  onSubmit: RsAnnotation => void,
};

type AddAnnotationContainerState = {
  formAnnotation: ?RsAnnotation,
  formValid: boolean,
  resetCounter: number,
};

class AddAnnotationContainer extends React.Component<
  AddAnnotationContainerProps,
  AddAnnotationContainerState,
> {
  static defaultProps = {
    ontologyAnnotationProperties: [],
    onSubmit: () => {},
  };

  static defaultState = {
    formAnnotation: null,
    formValid: false,
  };

  state = {
    formAnnotation: null,
    formValid: false,
    resetCounter: 0,
  };

  handleSubmitClick = () => {
    if (!this.state.formAnnotation) {
      return;
    }

    this.props.onSubmit(this.state.formAnnotation);
    this.setState({
      ...this.constructor.defaultState,
      resetCounter: this.state.resetCounter + 1,
    });
  };

  handleFormAnnotationChange = (formAnnotation: ?RsAnnotation) => {
    this.setState({ formAnnotation });
  };

  handleFormValidate = (valid: boolean) => {
    this.setState({ formValid: valid });
  };

  render() {
    return (
      <span
        className="border rounded"
        style={{
          padding: '20px',
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      >
        <h3>Add Annotation</h3>
        <AddAnnotationForm
          ontologyAnnotationProperties={this.props.ontologyAnnotationProperties}
          onAnnotationChange={this.handleFormAnnotationChange}
          onValidate={this.handleFormValidate}
          resetCounter={this.state.resetCounter}
        />
        <Button
          color="primary"
          onClick={this.handleSubmitClick}
          disabled={!this.state.formValid}
        >
          Submit
        </Button>{' '}
      </span>
    );
  }
}

module.exports = {
  AddAnnotationForm,
  AddAnnotationContainer,
};
