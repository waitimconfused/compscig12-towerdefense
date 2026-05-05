interface FaviconProbability extends Array<string|number> {
	length: 2;

	/**
	 * The probability of the `href` to be chosen
	 */
	0: number;

	/**
	 * The `href` value of the favicon
	 */
	1: string;
}

const sources:FaviconProbability[] = [
	[0.4, "/assets/favicon/2.png"],
	[0.2, "/assets/favicon/3.png"],
	[0.4, "/assets/favicon/1.png"],
].sort((a,b) => {
	let favicon1 = a as FaviconProbability;
	let favicon2 = b as FaviconProbability;

	return favicon1[0] - favicon2[0];
}) as FaviconProbability[];

console.log(sources);


const favicon = document.getElementById("favicon") as HTMLLinkElement;

let random = Math.random();


let probabilitySum = 0;
for (let i = 0; i < sources.length; i ++) {

	let faviconData = sources[i] as FaviconProbability

	probabilitySum += faviconData[0];

	if (random > probabilitySum) continue;

	favicon.href = faviconData[1];
	console.log("Favicon:", favicon.href, `(${faviconData[0]*100}% chance)`);

	break;

}