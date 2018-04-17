// @flow
/* eslint-disable no-underscore-dangle */
class ValueLink {
  context: any;
  key: string;

  _propsKey: string = 'value';
  _propsOnChangeKey: string = 'onChange';

  _onChange = this.constructor.defaultOnChange();
  _onChangeEventMapper = this.constructor.defaultOnChangeEventMapper();

  _afterChange = this.constructor.defaultAfterChange();

  static defaultOnChange() {
    const defaultOnChange = function defaultOnChange(e: any) {
      this.context.setState(
        {
          [this.key]: this._onChangeEventMapper(e),
        },
        () => {
          this._afterChange();
        },
      );
    };

    return defaultOnChange;
  }

  static defaultOnChangeEventMapper() {
    return (e: any) => e.target.value;
  }

  static defaultAfterChange() {
    return () => {};
  }

  clone(): ValueLink {
    const clone = Object.assign({}, this);
    Object.setPrototypeOf(clone, this.constructor.prototype);

    return (clone: any);
  }

  get value(): any {
    return this.context.state[this.key];
  }

  get props(): Object {
    return {
      [this._propsKey]: this.value,
      [this._propsOnChangeKey]: this._onChange.bind(this),
    };
  }

  propsKey(key: string) {
    const link = this.clone();
    link._propsKey = key;
    return link;
  }

  onChangeEventMapper(mapper: any) {
    const link = this.clone();
    link._onChangeEventMapper = mapper;
    return link;
  }

  afterChange(cb: any) {
    const link = this.clone();
    link._afterChange = cb;
    return link;
  }
}

function stateLink(key: string) {
  const link = new ValueLink();
  link.context = this;
  link.key = key;
  return link;
}

module.exports = {
  ValueLink,
  stateLink,
};
