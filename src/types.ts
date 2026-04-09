/**
 *! Global Types & Interfaces
 * A bunch of TypeScript type/interface declarations to
 * use wherever in the project
 */


/**
 * Array of length 2, filled with numbers representing a 2D coordinate system.
 * 
 * EG: `[ 10, 45 ]` (x=`10`, y=`45`), or `[ 16, 32 ]` (width=`16`, height=`32`)
 */
export interface Position2D extends Array<number> {
    length: 2;

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