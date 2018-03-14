class Annotation {
  constructor(data) {
    // const instance = new this();
    this.property = data.property;
    this.value = data.value;
  }

  hash(bayModule) {
    const rsValue = {
      property: this.property,
      value: this.value,
    };
    return bayModule.hash_annotation(rsValue);
  }
}

module.exports = {
  Annotation,
};
