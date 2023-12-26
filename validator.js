class Validator {
  constructor() {
    this.schema = {};
  }
  string() {
    this.schema = {
      ...this.schema,
      type: "string",
    };
    return this;
  }
  number() {
    this.schema = {
      ...this.schema,
      type: "number",
    };
    return this;
  }
  boolean() {
    this.schema = {
      ...this.schema,
      type: "boolean",
    };
    return this;
  }
  Object() {
    this.schema = {
      ...this.schema,
      type: "array",
    };
    return this;
  }
  isNullable() {
    this.schema = {
      ...this.schema,
      isNullable: true,
    };
    return this;
  }
  validateFunction(fn) {
    this.schema = {
      ...this.schema,
      isNullable: true,
      validationFunction: fn,
    };
    return this;
  }
}

const validation = new Validator();

validation.isNullable().string().validateFunction().number();
console.log(validation);
