/**
 * Base interface that all option types inherit from.
 * @template T The type of the value stored in the option
 */
export interface BaseOption<T> {
    /** Discriminator field to determine which specific option type this is */
    type: string;
    /** The actual value stored in the option */
    value: T;
    /** Optional flag to make the option read-only */
    readonly?: boolean;
}

// Interface definitions for different option types
/**
 * Represents a clickable button option.
 *
 * Extends `BaseOption` with 'any' type since buttons don't store values.
 */
export interface ButtonOption extends BaseOption<any> {
    type: "button";
    /** Optional text to display on the button */
    label?: string;
    /** Callback function to execute when button is clicked */
    onClick: () => void;
}

/**
 * Represents a boolean toggle/checkbox option.
 */
export interface BooleanOption extends BaseOption<boolean> {
    type: "boolean";
}

/**
 * Represents a floating-point number input.
 *
 * Includes optional range and step constraints.
 */
export interface FloatOption extends BaseOption<number> {
    type: "float";
    /** Optional minimum value */
    min?: number;
    /** Optional maximum value */
    max?: number;
    /** Optional step size for increments/decrements */
    step?: number;
}

/**
 * Represents an integer number input.
 *
 * Similar to FloatOption but for whole numbers.
 */
export interface IntOption extends BaseOption<number> {
    type: "int";
    /** Optional minimum value */
    min?: number;
    /** Optional maximum value */
    max?: number;
}

/**
 * Represents a text input option.
 */
export interface StringOption extends BaseOption<string> {
    type: "string";
}

/**
 * Represents a 2D vector input.
 */
export interface Vec2Option extends BaseOption<[number, number]> {
    type: "vec2";
    /** Optional minimum value for both coordinates */
    min?: number;
    /** Optional maximum value for both coordinates */
    max?: number;
    /** Optional step size for increments/decrements */
    step?: number;
    /** Option to invert the Y axis */
    invertY?: boolean;
}

/**
 * Represents a 3D vector input.
 */
export interface Vec3Option extends BaseOption<[number, number, number]> {
    type: "vec3";
    /** Optional minimum value for both coordinates */
    min?: number;
    /** Optional maximum value for both coordinates */
    max?: number;
    /** Optional step size for increments/decrements */
    step?: number;
}

/**
 * Represents a 4D vector input.
 */
export interface Vec4Option extends BaseOption<[number, number, number, number]> {
    type: "vec4";
    /** Optional minimum value for all coordinates */
    min?: number;
    /** Optional maximum value for all coordinates */
    max?: number;
    /** Optional step size for increments/decrements */
    step?: number;
}

/**
 * Represents an RGB color input.
 *
 * Stores value as a tuple of three numbers (red, green, blue).
 */
export interface ColorRgbOption extends BaseOption<[number, number, number]> {
    type: "rgb";
}

/**
 * Represents an RGBA color input.
 *
 * Stores value as a tuple of four numbers (red, green, blue, alpha).
 */
export interface ColorRgbaOption extends BaseOption<[number, number, number, number]> {
    type: "rgba";
}

/**
 * Union type combining all possible option types. Used for type-safe handling of any option type.
 */
export type AllOptions =
    | ButtonOption
    | BooleanOption
    | FloatOption
    | IntOption
    | StringOption
    | Vec2Option
    | Vec3Option
    | Vec4Option
    | ColorRgbOption
    | ColorRgbaOption;

/**
 * Interface for a map of option IDs to their corresponding option objects.
 * Used to store and manage multiple options.
 */
export interface SlidersOptionsMap {
    [id: string]: AllOptions;
}
