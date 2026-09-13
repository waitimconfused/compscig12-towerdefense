var variableMap = {
    state: "entity.state",
    health: "entity.stats.health",
    max_health: "entity.constructor.baseStats.health * ( 1 + entity.constructor.level*entity.constructor.statIncreaseMultiplier  )",
    level: "entity.constructor.level",
};
function rulesToIfStatement(logic) {
    let string = "";
    for (let i = 0; i < logic.length; i++) {
        let ruleset = logic[i];
        let layers = ruleset.layers;
        if (i > 0)
            string += "else ";
        if (ruleset.layers) {
            let layersString = JSON.stringify(layers, null, "\t");
            layersString = layersString.replace(/\[\s*(\d*),\s*(\d*)\s*\]/gm, "[ $1, $2 ]");
            string += `if (${ruleset.rule}) return ${layersString};`;
        }
        else if (ruleset.logic) {
            string += `if (${ruleset.rule}) {\n`;
            let ifStatement = rulesToIfStatement(ruleset.logic);
            ifStatement = ifStatement.split("\n").map(line => "\t" + line).join("\n");
            string += ifStatement;
            string += "\n}";
        }
        if (i < logic.length - 1)
            string += "\n\n";
    }
    return string;
}
export function rulesToFunction(logic) {
    let string = rulesToIfStatement(logic);
    let defaultVariables = "";
    for (let key in variableMap) {
        defaultVariables += `let ${key} = ${variableMap[key]};\n`;
    }
    defaultVariables += "\n";
    string = defaultVariables + string;
    let generatedFunction = Function("entity", string);
    return generatedFunction;
}
//# sourceMappingURL=logic-flow.js.map