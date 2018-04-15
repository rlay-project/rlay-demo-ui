// @flow
import React from 'react';
import { Button, Form, FormGroup } from 'reactstrap';
import Select from 'react-select';
import { isEmpty } from 'lodash-es';

import { Annotation, Class as Klass, Individual } from '../classes';

type AddIndividualFormProps = {
  onIndividualChange: (?Individual) => void,
  onValidate: boolean => void,
  ontologyAnnotations: Array<Annotation>,
  ontologyClasses: Array<Klass>,
  resetCounter: number,
};

type AddIndividualFormState = {
  valueAnnotations: Array<any>,
  valueClassAssertions: Array<any>,
  valueNegativeClassAssertions: Array<any>,
};

class AddIndividualForm extends React.Component<
  AddIndividualFormProps,
  AddIndividualFormState,
> {
  static defaultProps = {
    onIndividualChange: () => {},
    onValidate: () => {},
    ontologyAnnotations: [],
    ontologyClasses: [],
    resetCounter: 0,
  };

  static defaultState = {
    valueAnnotations: [],
    valueClassAssertions: [],
    valueNegativeClassAssertions: [],
  };

  state = AddIndividualForm.defaultState;

  componentWillReceiveProps(nextProps: AddIndividualFormProps) {
    if (this.props.resetCounter !== nextProps.resetCounter) {
      this.setState(AddIndividualForm.defaultState, () =>
        this.handleClassChange(),
      );
    }
  }

  handleAnnotationsSelectChange = (selectedOptions: any) => {
    this.setState({ valueAnnotations: selectedOptions }, () =>
      this.handleClassChange(),
    );
  };

  handleClassAssertionsChange = (selectedOptions: any) => {
    this.setState({ valueClassAssertions: selectedOptions }, () =>
      this.handleClassChange(),
    );
  };

  handleNegativeClassAssertionsChange = (selectedOptions: any) => {
    this.setState({ valueNegativeClassAssertions: selectedOptions }, () =>
      this.handleClassChange(),
    );
  };

  buildIndividual = () => {
    if (!this.validate()) {
      return null;
    }

    const item = new Individual({
      annotations: this.state.valueAnnotations.map(n => n.cid()),
      class_assertions: this.state.valueClassAssertions.map(n => n.cid()),
      negative_class_assertions: this.state.valueNegativeClassAssertions.map(
        n => n.cid(),
      ),
    });
    return item;
  };

  handleClassChange = () => {
    const valid = this.validate();
    this.props.onValidate(valid);
    const klass = valid ? this.buildIndividual() : null;
    this.props.onIndividualChange(klass);
  };

  validate = () => {
    if (
      isEmpty(this.state.valueAnnotations) &&
      isEmpty(this.state.valueClassAssertions) &&
      isEmpty(this.state.valueNegativeClassAssertions)
    ) {
      return false;
    }

    return true;
  };

  render() {
    const { ontologyAnnotations, ontologyClasses } = this.props;

    return (
      <Form>
        <FormGroup>
          <Select
            options={ontologyAnnotations}
            multi
            labelKey="label"
            value={this.state.valueAnnotations}
            onChange={this.handleAnnotationsSelectChange}
            isOptionUnique={() => true}
            placeholder="Select Annotations..."
          />
        </FormGroup>
        <FormGroup>
          <Select
            options={ontologyClasses}
            multi
            labelKey="label"
            value={this.state.valueClassAssertions}
            onChange={this.handleClassAssertionsChange}
            isOptionUnique={() => true}
            placeholder="Select Class assertions..."
          />
        </FormGroup>
        <FormGroup>
          <Select
            options={ontologyClasses}
            multi
            labelKey="label"
            value={this.state.valueNegativeClassAssertions}
            onChange={this.handleNegativeClassAssertionsChange}
            isOptionUnique={() => true}
            placeholder="Select Negative class assertions..."
          />
        </FormGroup>
      </Form>
    );
  }
}

type AddIndividualContainerProps = {
  ontologyAnnotations: Array<Annotation>,
  ontologyClasses: Array<Klass>,
  onSubmit: Individual => void,
};

type AddIndividualContainerState = {
  formIndividual: ?Individual,
  formValid: boolean,
  resetCounter: number,
};

class AddIndividualContainer extends React.Component<
  AddIndividualContainerProps,
  AddIndividualContainerState,
> {
  static defaultProps = {
    ontologyAnnotations: [],
    ontologyClasses: [],
    onSubmit: () => {},
  };

  static defaultState = {
    formIndividual: null,
    formValid: false,
  };

  state = {
    formIndividual: null,
    formValid: false,
    resetCounter: 0,
  };

  handleSubmitClick = () => {
    if (!this.state.formIndividual) {
      return;
    }

    this.props.onSubmit(this.state.formIndividual);
    this.setState({
      ...this.constructor.defaultState,
      resetCounter: this.state.resetCounter + 1,
    });
  };

  handleFormIndividualChange = (formIndividual: ?Individual) => {
    this.setState({ formIndividual });
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
        <h3>Add Statement</h3>
        <AddIndividualForm
          ontologyAnnotations={this.props.ontologyAnnotations}
          ontologyClasses={this.props.ontologyClasses}
          onIndividualChange={this.handleFormIndividualChange}
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
  AddIndividualForm,
  AddIndividualContainer,
};
