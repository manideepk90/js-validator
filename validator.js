export class Validator {
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
      nullable: true,
    };
    return this;
  }
  validateFunction(fn) {
    this.schema = {
      ...this.schema,
      validationFunction: fn,
    };
    return this;
  }
  required() {
    this.schema = {
      ...this.schema,
      isRequired: true,
    };
    return this;
  }
}

export class Validation {
  constructor(schema, data) {
    var errors = [];
    if (Object.keys(schema).length === 0) {
      errors.push(new Error("No schema found"));
    }
    this.schema = schema;
    this.data = data;
    for (const key of Object.keys(schema)) {
      const isNullable = this.#isNullable(key);
      if (!isNullable && this.#isNull(key)) {
        errors.push(new Error(`${key} cannot be nullable`));
      }
      if (!this.#isString(key)) errors.push(new Error(`${key} must be string`));
      if (!this.#isNumber(key)) errors.push(Error(`${key} must be an integer`));
      if (this.#isRequired(key))
        if (!this.#checkValues(key)) errors.push(Error(`${key} is required`));
    }
    if (errors.length !== 0) {
      return errors;
    }
    return data;
  }
  #isNullable(key) {
    return this.schema[key].schema?.nullable
      ? this.schema[key].schema?.nullable
      : false;
  }
  #isNull(key) {
    return this.data[key] === undefined || this.data[key] === null;
  }
  #isString(key) {
    if (this.#isNull(key)) {
      return true;
    }
    if (this.schema[key].schema?.type === "string")
      return typeof this.data[key] === "string";
    return true;
  }
  #isNumber(key) {
    if (this.#isNull(key)) {
      return true;
    }
    if (this.schema[key].schema?.type === "number")
      return typeof this.data[key] === "number";
    return true;
  }
  #checkValues(key) {
    return this.data[key] ? true : false;
  }
  #isRequired(key) {
    return this.schema[key].schema?.isRequired ? true : false;
  }
}