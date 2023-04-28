export enum basicTypes {
  boolean = "boolean",
  integer = "integer",
  number = "number",
  string = "string",
  enum = "enum",  // https://swagger.io/docs/specification/data-models/enums/
}

export interface iField {
  name: string;
  type: basicTypes;
  required: boolean;
  nullable: boolean;    // https://swagger.io/docs/specification/data-models/data-types/#null
  title: string;
  defaultValue?: string | number | boolean
  description?: string;
}

//https://swagger.io/docs/specification/data-models/data-types/#numbers
export enum numberValidFormatValues {
  float = "float",
  double = "double",
}

export enum integerValidFormatValues {
  int32 = "int32",
  int64 = "int64",
}

// https://swagger.io/docs/specification/data-models/data-types/#string
export enum stringValidFormatValues {
  date = "date",
  datetime = "datetime",
  time = "time",
  email = "email",
  text = "text",
  uuid = "uuid"
}

type numberConstraints = {
  minimum?: number;
  exclusiveMinimum?: boolean;
  maximum?: number;
  exclusiveMaximum?: boolean;
}
type stringConstraints = {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}
export type fieldInfoBoolean = {
  title: string;
  type: basicTypes.boolean;
}
export type fieldInfoInteger = numberConstraints & {
  title: string;
  type: basicTypes.integer;
  format?: integerValidFormatValues;
}
export type fieldInfoNumber = numberConstraints & {
  title: string;
  type: basicTypes.number;
  format: numberValidFormatValues;
}
export type fieldInfoString = stringConstraints & {
  title: string;
  type: basicTypes.string;
  format?: stringValidFormatValues;
}

export type fieldInfo = fieldInfoBoolean | fieldInfoInteger | fieldInfoNumber | fieldInfoString;

export abstract class baseField implements iField {
  protected readonly _name: string;
  protected readonly _type: basicTypes;
  protected readonly _required: boolean;
  protected readonly _nullable: boolean;    // https://swagger.io/docs/specification/data-models/data-types/#null
  private _title: string;
  private _defaultValue?: string | number | boolean
  private _description?: string;

  get name(): string {
    return this._name
  }

  get type(): basicTypes {
    return this._type
  }

  get required(): boolean {
    return this._required
  }

  get nullable(): boolean {
    return this._nullable
  }

  get title(): string {
    return this._title
  }

  set title(val: string) {
    this._title = val
  }

  get defaultValue(): string | number | boolean {
    return this._defaultValue === undefined ? '' : this._defaultValue;
  }

  set defaultValue(val: string | number | boolean) {
    this._defaultValue = val
  }

  get description(): string {
    return this._description === undefined ? '' : this._description;
  }

  set description(val: string) {
    this._description = val
  }

  abstract minLength():number|undefined;
  abstract maxLength():number|undefined;
  abstract minimum():number|undefined;
  abstract maximum():number|undefined;

  protected constructor(name: string,
              type: basicTypes,
              title: string,
              required: boolean = false,
              nullable: boolean = true,
              defaultValue?: string | number | boolean,
              description?: string,
  ) {
    console.log("# Field Constructor ")
    this._name = name
    this._type = type
    this._title = title
    this._required = required
    this._nullable = nullable
    this._defaultValue = defaultValue
    this._description = description
  }
  baseDump=():string => `Field: ${this.name}[${this.type}] required:${this.required}`;

} // end of class Field

export class FBoolean extends baseField {
  constructor(name: string,
              title: string,
              required: boolean = false,
              nullable: boolean = true,
              defaultValue?: string | number | boolean,
              description?: string)
  {
    super(name,basicTypes.boolean,title,required,nullable,defaultValue,description);
  }

  maxLength(): number | undefined {
    return undefined;
  }

  maximum(): number | undefined {
    return undefined;
  }

  minLength(): number | undefined {
    return undefined;
  }

  minimum(): number | undefined {
    return undefined;
  }

}
export class FInteger extends baseField {

  private readonly _constraints:numberConstraints
  private readonly _format:integerValidFormatValues | undefined

  get constraints(): numberConstraints {
    return this._constraints;
  }
  get format(): integerValidFormatValues {
    return this._format == undefined ?  integerValidFormatValues.int32 : this._format;
  }
  constructor(name: string,
              title: string,
              required: boolean = false,
              nullable: boolean = true,
              defaultValue?: string | number | boolean,
              description?: string,
              format?: integerValidFormatValues,
              constraints?: numberConstraints
  )
  {
    console.log("# FInteger Constructor ")
    super(name,basicTypes.integer,title,required,nullable,defaultValue,description);
    this._format = format
    this._constraints = Object.assign({}, constraints)
  }
  minLength(): number | undefined {
    return undefined;
  }
  maxLength(): number | undefined {
    return undefined;
  }
  minimum(): number | undefined {
    if (this.constraints !== undefined){
      if (this.constraints.minimum !== undefined) {
        return this.constraints.minimum
      }
    }
    return undefined;
  }
  maximum(): number | undefined {
    if (this.constraints !== undefined){
      if (this.constraints.maximum !== undefined) {
        return this.constraints.maximum
      }
    }
    return undefined;
  }
  dump=():string =>{
    console.log("# FInteger dump :", this)
    return  `${this.baseDump()},${this._format}`

  }
}

export class FNumber extends baseField {
  private readonly _constraints:numberConstraints
  private readonly _format:numberValidFormatValues | undefined
  get constraints(): numberConstraints {
    return this._constraints;
  }
  get format(): numberValidFormatValues {
    return this._format == undefined ? numberValidFormatValues.double: this._format;
  }
  constructor(name: string,
              title: string,
              required: boolean = false,
              nullable: boolean = true,
              defaultValue?: string | number | boolean,
              description?: string,
              format?: numberValidFormatValues,
              constraints?: numberConstraints
  )
  {
    console.log("# FNumber Constructor ")
    super(name,basicTypes.number,title,required,nullable,defaultValue,description);
    this._format = format
    this._constraints = Object.assign({}, constraints)
  }
  minLength(): number | undefined {
    return undefined;
  }
  maxLength(): number | undefined {
    return undefined;
  }
  minimum(): number | undefined {
    if (this.constraints !== undefined){
      if (this.constraints.minimum !== undefined) {
        return this.constraints.minimum
      }
    }
    return undefined;
  }
  maximum(): number | undefined {
    if (this.constraints !== undefined){
      if (this.constraints.maximum !== undefined) {
        return this.constraints.maximum
      }
    }
    return undefined;
  }
  dump=():string =>{
    console.log("# FNumber dump :", this)
    return  `${this.baseDump()},${this._format}`

  }
}

export class FString extends baseField {
  private readonly _constraints:stringConstraints
  private readonly _format:stringValidFormatValues | undefined
  get constraints(): stringConstraints {
    return this._constraints;
  }
  get format(): stringValidFormatValues {
    return this._format == undefined ? stringValidFormatValues.text: this._format;
  }
  constructor(name: string,
              title: string,
              required: boolean = false,
              nullable: boolean = true,
              defaultValue?: string | number | boolean,
              description?: string,
              format?: stringValidFormatValues,
              constraints?: stringConstraints
  )
  {
    console.log("# FString Constructor ")
    super(name,basicTypes.string,title,required,nullable,defaultValue,description);
    this._format = format
    this._constraints = Object.assign({}, constraints)
  }
  minLength(): number | undefined {
    if (this.constraints !== undefined){
      if (this.constraints.minLength !== undefined) {
        return this.constraints.minLength
      }
    }
    return undefined;
  }
  maxLength(): number | undefined {
    if (this.constraints !== undefined){
      if (this.constraints.maxLength !== undefined) {
        return this.constraints.maxLength
      }
    }
    return undefined;
  }
  minimum(): number | undefined {
    return undefined;
  }
  maximum(): number | undefined {
    return undefined;
  }
  dump=():string =>{
    console.log("# FString dump :", this)
    return  `${this.baseDump()},${this._format}`

  }
}
