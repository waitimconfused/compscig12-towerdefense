/**
 *! Global Types & Interfaces
 * A bunch of TypeScript type/interface declarations to
 * use wherever in the project
 */

type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | number;
export type FixedArray<T extends any[]> = Pick< T, Exclude<keyof T, ArrayLengthMutationKeys> >;

/**
 * Array of length 2, filled with numbers representing a 2D coordinate system.
 * 
 * > EG: `[ 10, 45 ]` (`x=10`, `y=45`)
 * 
 * > EG: `[ 16, 32 ]` (`width=16`, `height=32`)
 */
export interface Position2D extends FixedArray<[number, number]> {

	/**
	 * `Position2D[0]:number`: ***X**-coordinate*
	 */
    0: number;

	/**
	 * `Position2D[1]:number`: ***Y**-coordinate*
	 */
    1: number;

}

/**
 * The 2D contexts of types of *Canvases* that can be
 * rendered on (`Canvas` and `OffscreenCanvas`)
 */
export type RenderingContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

/**
 * The 2D contexts of types of *Canvases* that can be
 * rendered on (`Canvas` and `OffscreenCanvas`)
 */
export type Canvas = HTMLCanvasElement | OffscreenCanvas;

/**
 * The `StaticClass` (and the extensions of it) are a static class.
 * 
 * No instances are to be made.
 * 
 * *Attempting to **create an instance** of it results in **throwing a `TypeError`.***
 */
export class StaticClass {

	constructor() {

		// Get the class's constructor
		let constructor = this.constructor as typeof StaticClass;
		
		// Get the name of the class (eg: `"StaticClass"`)
		let className = constructor.name;

		// Throw a TypeError
		throw new TypeError(`${className} is not a constructor`);

	}

}