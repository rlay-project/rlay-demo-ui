// @flow
import React from 'react';
import { Button, Form, FormGroup } from 'reactstrap';
import Select from 'react-select';
import { isEmpty } from 'lodash-es';

import { Annotation, Class as Klass } from '../classes';

type AddClassFormProps = {
  onClassChange: (?Klass) => void,
  onValidate: boolean => void,
  ontologyAnnotations: Array<Annotation>,
  ontologyClasses: Array<Klass>,
  resetCounter: number,
};

type AddClassFormState = {
  valueAnnotations: Array<any>,
  valueSubClassOfClass: Array<any>,
};

class AddClassForm extends React.Component<
  AddClassFormProps,
  AddClassFormState,
> {
  static defaultProps = {
    onClassChange: () => {},
    onValidate: () => {},
    ontologyAnnotations: [],
    ontologyClasses: [],
    resetCounter: 0,
  };

  static defaultState = {
    valueAnnotations: [],
    valueSubClassOfClass: [],
  };

  state = AddClassForm.defaultState;

  componentWillReceiveProps(nextProps: AddClassFormProps) {
    if (this.props.resetCounter !== nextProps.resetCounter) {
      this.setState(AddClassForm.defaultState, () => this.handleClassChange());
    }
  }

  handleAnnotationsSelectChange = (selectedOptions: any) => {
    this.setState({ valueAnnotations: selectedOptions }, () =>
      this.handleClassChange(),
    );
  };

  handleSubClassOfClassSelectChange = (selectedOptions: any) => {
    this.setState({ valueSubClassOfClass: selectedOptions }, () =>
      this.handleClassChange(),
    );
  };

  buildClass = () => {
    if (!this.validate()) {
      return null;
    }

    const klass = new Klass({
      annotations: this.state.valueAnnotations.map(n => n.cid()),
      sub_class_of_class: this.state.valueSubClassOfClass.map(n => n.cid()),
    });
    return klass;
  };

  handleClassChange = () => {
    const valid = this.validate();
    this.props.onValidate(valid);
    const klass = valid ? this.buildClass() : null;
    this.props.onClassChange(klass);
  };

  validate = () => {
    if (
      isEmpty(this.state.valueAnnotations) &&
      isEmpty(this.state.valueSubClassOfClass)
    ) {
      return false;
    }

    return true;
  };

  render() {
    const { ontologyAnnotations, ontologyClasses } = this.props;

    const annotationOptions = ontologyAnnotations.map(item => {
      const newItem = item.clone();
      newItem.labelRes = newItem.label();
      return newItem;
    });

    const classOptions = ontologyClasses.map(item => {
      const newItem = item.clone();
      newItem.labelRes = newItem.label();
      return newItem;
    });

    return (
      <Form>
        <FormGroup>
          <Select
            options={annotationOptions}
            multi
            labelKey="labelRes"
            value={this.state.valueAnnotations}
            onChange={this.handleAnnotationsSelectChange}
            isOptionUnique={() => true}
            placeholder="Select Annotations..."
          />
        </FormGroup>
        <FormGroup>
          <Select
            options={classOptions}
            multi
            labelKey="labelRes"
            value={this.state.valueSubClassOfClass}
            onChange={this.handleSubClassOfClassSelectChange}
            isOptionUnique={() => true}
            placeholder="Select SubClassOf classes..."
          />
        </FormGroup>
      </Form>
    );
  }
}

type AddClassContainerProps = {
  ontologyAnnotations: Array<Annotation>,
  ontologyClasses: Array<Klass>,
  onSubmit: Klass => void,
};

type AddClassContainerState = {
  formClass: ?Klass,
  formValid: boolean,
  resetCounter: number,
};

class AddClassContainer extends React.Component<
  AddClassContainerProps,
  AddClassContainerState,
> {
  static defaultProps = {
    ontologyAnnotations: [],
    ontologyClasses: [],
    onSubmit: () => {},
  };

  static defaultState = {
    formClass: null,
    formValid: false,
  };

  state = {
    formClass: null,
    formValid: false,
    resetCounter: 0,
  };

  handleSubmitClick = () => {
    if (!this.state.formClass) {
      return;
    }

    this.props.onSubmit(this.state.formClass);
    this.setState({
      ...this.constructor.defaultState,
      resetCounter: this.state.resetCounter + 1,
    });
  };

  handleFormClassChange = (formClass: ?Klass) => {
    this.setState({ formClass });
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
        <h3>Add Class</h3>
        <AddClassForm
          ontologyAnnotations={this.props.ontologyAnnotations}
          ontologyClasses={this.props.ontologyClasses}
          onClassChange={this.handleFormClassChange}
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
  AddClassForm,
  AddClassContainer,
};
