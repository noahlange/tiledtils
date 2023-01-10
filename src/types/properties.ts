export enum PropertyType {
  BOOLEAN = 'bool',
  COLOR = 'color',
  FLOAT = 'float',
  INTEGER = 'int',
  OBJECT = 'object',
  STRING = 'string'
}

export type PropertyValue = string | boolean | number | null | undefined;

export type Property =
  | {
      name: string;
      type: PropertyType.BOOLEAN;
      value: boolean;
    }
  | {
      name: string;
      type: PropertyType.COLOR | PropertyType.STRING;
      value: string;
    }
  | {
      name: string;
      type: PropertyType.FLOAT | PropertyType.INTEGER | PropertyType.OBJECT;
      value: number;
    };

export type Properties = Record<string, PropertyValue>;

export type SansProperties<T> = Omit<T, 'properties'>;
export type WithProperties<T> = T & { properties?: Property[] };
