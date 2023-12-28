
export class Validator {
  constructor() {
    this.schema = {};
  }
  string(customTypeMsg) {
    this.schema = {
      ...this.schema,
      type: "string",
      customTypeMsg,
    };
    return this;
  }
  number(customTypeMsg) {
    this.schema = {
      ...this.schema,
      type: "number",
      customTypeMsg,
    };
    return this;
  }
  boolean(customTypeMsg) {
    this.schema = {
      ...this.schema,
      type: "boolean",
      customTypeMsg,
    };
    return this;
  }
  Object(customTypeMsg) {
    this.schema = {
      ...this.schema,
      type: "array",
      customTypeMsg,
    };
    return this;
  }
  isNullable(nullableMsg) {
    this.schema = {
      ...this.schema,
      nullable: true,
      nullableMsg,
    };
    return this;
  }
  validateFunction(fn, fnErrorMessage) {
    this.schema = {
      ...this.schema,
      validationFunction: fn,
      fnErrorMessage,
    };
    return this;
  }
  required(errorMessage) {
    this.schema = {
      ...this.schema,
      isRequired: true,
      requiredErrorMessage: errorMessage,
    };
    return this;
  }
}

export class Validation {
  constructor(schema, data, fn) {
    this.errors = {};
    if (Object.keys(schema).length === 0) {
      this.errors["main"] = new Error("No schema found");
    }
    this.schema = schema;
    this.data = data;
    for (const key of Object.keys(schema)) {
      if (fn) {
        fn(this, key);
      } else {
        this.checkData(this.schema[key], this.data[key], key);
      }
    }
    if (Object.keys(this.errors).length !== 0) {
      return { errors: this.errors, data: {} };
    }
    return { data: this.data, errors: {} };
  }
  checkData(schema, data, key) {
    schema = schema?.schema;
    const isNullable = this.#isNullable(schema);
    if (!isNullable && this.#isNull(schema, data)) {
      this.errors[key] = new Error(
        schema?.nullableMsg ? schema?.nullableMsg : `${key} cannot be nullable`
      );
    }
    if (!this.#isString(schema, data))
      this.errors[key] = new Error(
        schema?.customTypeMsg ? schema?.customTypeMsg : `${key} must be string`
      );

    if (!this.#isNumber(schema, data))
      this.errors[key] = new Error(
        schema?.customTypeMsg
          ? schema?.customTypeMsg
          : `${key} must be an integer`
      );

    if (this.#isRequired(schema, data))
      if (!this.#checkValues(schema, data))
        this.errors[key] = new Error(
          schema?.requiredErrorMessage
            ? schema?.requiredErrorMessage
            : `${key} is required`
        );
  }
  #isNullable(schema) {
    return schema?.nullable ? schema?.nullable : false;
  }
  #isNull(schema, data) {
    return data === undefined || data === null;
  }
  #isString(schema, data) {
    if (this.#isNull(schema, data)) {
      return true;
    }
    if (schema?.type === "string") return typeof data === "string";
    return true;
  }
  #isNumber(schema, data) {
    if (this.#isNull(schema, data)) {
      return true;
    }
    if (schema?.type === "number") return typeof data === "number";
    return true;
  }
  #checkValues(schema, data) {
    return data ? true : false;
  }
  #isRequired(schema, data) {
    return schema?.isRequired ? true : false;
  }
}
