import { Entity } from "./entity.js";

/**
 * Array of length 2, filled with numbers representing a 2D coordinate system.
 * 
 * > EG: `[ 10, 45 ]` (`x=10`, `y=45`)
 * 
 * > EG: `[ 16, 32 ]` (`width=16`, `height=32`)
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

export type BasicSprite = {
	sprite: string;
	origin: Position2D;
	rotation?: number;
	offset?: Position2D;
};

type Rule = {
	rule: string;
	layers: BasicSprite[]
};

export type RawSpriteLogic = {

	/**
	 * Matches to `entity.entityType`
	 */
	type: string;

	logic: Rule[];
};

var variableMap:{ [name:string]: string } = {
	state: "entity.state",
	health: "entity.stats.health",
	max_health: "entity.stats.max_health"
}

export function rulesToFunction(logic:Rule[]):(entity:Entity)=>BasicSprite[] {

	let string = "";

	for (let key in variableMap) {
		string += `let ${key} = ${variableMap[key]};\n`;
	}
	string += "\n";

	for (let i = 0; i < logic.length; i ++) {

		let ruleset = logic[i] as Rule;
		let layers = ruleset.layers;

		let layersString = JSON.stringify(layers, null, "\t");
		layersString = layersString.replace(/\[\s*(\d*),\s*(\d*)\s*\]/gm, "[ $1, $2 ]");

		if (i > 0) string += "else ";
		string += `if (${ruleset.rule}) return ${layersString};`;

		if (i < logic.length - 1) string += "\n\n";
	}

	let generatedFunction = Function("entity", string) as (entity:Entity)=>BasicSprite[];

	return generatedFunction;

}
