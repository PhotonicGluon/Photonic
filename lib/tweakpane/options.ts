export interface BaseOption<T> {
    type: unknown;
    value: T;
    readonly?: boolean;
}

// Main interfaces
export interface ButtonOption extends BaseOption<any> {
    type: "button";
    label?: string;
    onClick: () => void;
}
export interface BooleanOption extends BaseOption<boolean> {
    type: "boolean";
}

export interface FloatOption extends BaseOption<number> {
    type: "float";
    min?: number;
    max?: number;
    step?: number;
}

export interface IntOption extends BaseOption<number> {
    type: "int";
    min?: number;
    max?: number;
}

export interface StringOption extends BaseOption<string> {
    type: "string";
}

export interface Vec2Option extends BaseOption<[number, number]> {
    type: "vec2";
    min?: number;
    max?: number;
    step?: number;
    invertY?: boolean;
}

export interface ColorRgbOption extends BaseOption<[number, number, number]> {
    type: "rgb";
}

export interface ColorRgbaOption extends BaseOption<[number, number, number, number]> {
    type: "rgba";
}

// Composite
export type AllOptions =
    | ButtonOption
    | BooleanOption
    | FloatOption
    | IntOption
    | StringOption
    | Vec2Option
    | ColorRgbOption
    | ColorRgbaOption;

export interface SlidersOptionsMap {
    [id: string]: AllOptions;
}
