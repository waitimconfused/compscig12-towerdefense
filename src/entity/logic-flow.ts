import { Position2D } from "../types.js";
import { Entity } from "./entity.js";

export type BasicSprite = {
	sprite: string;
	origin: Position2D;
	rotation?: number;
	offset?: Position2D;
	frames?: number[];
};

type Rule = {
	rule: string;
	layers?: BasicSprite[]
	logic?: Rule[]
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
	max_health: "entity.constructor.baseStats.health * ( 1 + entity.constructor.level*entity.constructor.statIncreaseMultiplier  )",
	level: "entity.constructor.level",
}

function rulesToIfStatement(logic:Rule[]):string {

	let string = "";

	for (let i = 0; i < logic.length; i ++) {

		let ruleset = logic[i] as Rule;
		let layers = ruleset.layers;

		
		if (i > 0) string += "else ";
		
		if (ruleset.layers) {
			let layersString = JSON.stringify(layers, null, "\t");
			layersString = layersString.replace(/\[\s*(\d*),\s*(\d*)\s*\]/gm, "[ $1, $2 ]");
			string += `if (${ruleset.rule}) return ${layersString};`;

		} else if (ruleset.logic) {
			string += `if (${ruleset.rule}) {\n`;

			// Get an IF STATEMENT containing the nested logic
			let ifStatement = rulesToIfStatement(ruleset.logic);

			// Indent the IF STATEMENT: Add a indent "\t" to each line
			ifStatement = ifStatement.split("\n").map(line=>"\t"+line).join("\n");

			string += ifStatement;
			string += "\n}";
		}

		if (i < logic.length - 1) string += "\n\n";
	}

	return string;

}

export function rulesToFunction(logic:Rule[]):(entity:Entity)=>BasicSprite[] {

	let string = rulesToIfStatement(logic);

	let defaultVariables = "";
	for (let key in variableMap) {
		defaultVariables += `let ${key} = ${variableMap[key]};\n`;
	}
	defaultVariables += "\n";

	string = defaultVariables + string;

	let generatedFunction = Function("entity", string) as (entity:Entity)=>BasicSprite[];

	return generatedFunction;

}
