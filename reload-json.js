const fs = require("fs");

const is_verbose = process.argv.includes("verbose");

if (is_verbose) console.log("----- Sprites & Sprite Rendering Logic -----");
let spriteFiles = fs.globSync("assets/**/*(sprite.json|sprites.json|*-sprite.json|*-sprites.json)").sort();

if (is_verbose) console.log("Sprites (relative to assets/sprites.json): ");
else console.log(`Sprite Data: ${spriteFiles.length} files`)

for (let i = 0; i < spriteFiles.length; i ++) {

	let path = spriteFiles[i];

	spriteFiles[i] = path.replace(/^assets\//, "./");

	if (spriteFiles[i] == "./sprites.json") {
		spriteFiles.splice(i, 1);
		i -= 1;
		continue;
	}

	if (is_verbose) console.log(`\t- "${spriteFiles[i]}"`);
}



let logicFiles = fs.globSync("assets/**/*(logic.json|*-logic.json)").sort();

if (is_verbose) console.log("\nLogic (relative to assets/sprites.json): ");
else console.log(`Logic Data:  ${logicFiles.length} files`)

for (let i = 0; i < logicFiles.length; i ++) {

	let path = logicFiles[i];

	logicFiles[i] = path.replace(/^assets\//, "./");

	if (is_verbose) console.log(`\t- "${logicFiles[i]}"`);
}



const spriteJson = {
	assets: spriteFiles,
	logic: logicFiles
};

fs.writeFileSync("assets/sprites.json", JSON.stringify(spriteJson, null, "\t"));


if (is_verbose) console.log("\n----- Views -----");
let viewPaths = fs.globSync("src/view/views/*.ts").sort();

if (is_verbose) console.log("Views (relative to src/view/views.json): ");
else console.log(`Views:       ${viewPaths.length} files`);

for (let i = 0; i < viewPaths.length; i ++) {

	let path = viewPaths[i];

	viewPaths[i] = path.replace(/^src\/view\//, "./");

	if (is_verbose) console.log(`\t- "${viewPaths[i]}"`);
}

fs.writeFileSync("src/view/views.json", JSON.stringify(viewPaths, null, "\t"));