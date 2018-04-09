// @flow
import React from 'react';
import { Form, FormGroup } from 'reactstrap';
import Select from 'react-select';
import { isEmpty } from 'lodash-es';

import { Annotation, Class as Klass } from '../classes';

type AddClassFormProps = {
  ontologyAnnotations: Array<Annotation>,
  ontologyClasses: Array<Klass>,
  resetCounter: number,
  onClassChange: (?Klass) => void,
  onValidate: boolean => void,
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
    ontologyAnnotations: [],
    ontologyClasses: [],
    resetCounter: 0,
    onClassChange: () => {},
    onValidate: () => {},
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
      annotations: this.state.valueAnnotations.map(n => n.hash),
      sub_class_of_class: this.state.valueSubClassOfClass.map(n => n.hash),
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

    const annotationOptions = ontologyAnnotations.map(n => ({
      ...n,
      label: n.label(),
    }));

    const classOptions = ontologyClasses.map(n => ({
      ...n,
      label: n.label(),
    }));

    return (
      <Form>
        <FormGroup>
          <Select
            options={annotationOptions}
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
            options={classOptions}
            multi
            labelKey="label"
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

// type AddClassContainerProps = {
// ontologyAnnotations: Array<AnnotationProperty>,
// onSubmit: (RsAnnotation) => void,
// };

// type AddClassContainerState = {
// formAnnotation: ?RsAnnotation,
// formValid: boolean,
// resetCounter: number,
// };

// class AddClassContainer extends React.Component<AddClassContainerProps, AddClassContainerState> {
// static defaultProps = {
// ontologyAnnotations: [],
// onSubmit: () => {},
// }

// static defaultState = {
// formAnnotation: null,
// formValid: false,
// }

// state = {
// formAnnotation: null,
// formValid: false,
// resetCounter: 0,
// }

// handleSubmitClick = () => {
// if (!this.state.formAnnotation) {
// return;
// }

// const { ontologyAnnotations } = this.props;

// this.props.onSubmit(this.state.formAnnotation);
// this.setState({
// ...AddClassContainer.defaultState,
// resetCounter: this.state.resetCounter + 1,
// });
// }

// handleFormAnnotationChange = (formAnnotation: ?RsAnnotation) => {
// this.setState({ formAnnotation });
// }

// handleFormValidate = (valid: boolean) => {
// this.setState({ formValid: valid });
// }

// render() {
// return (
// <span className="border rounded" style={{ padding: '20px', display: 'block', width: '100%', height: '100%' }}>
// <h3>Add Class</h3>
// <AddClassForm
// ontologyAnnotations={this.props.ontologyAnnotations}
// onClassChange={this.handleFormAnnotationChange}
// onValidate={this.handleFormValidate}
// resetCounter={this.state.resetCounter}
// />
// <Button color="primary" onClick={this.handleSubmitClick} disabled={!this.state.formValid}>Submit</Button>{' '}
// </span>
// );
// }
// }

module.exports = {
  AddClassForm,
  // AddClassContainer,
};
