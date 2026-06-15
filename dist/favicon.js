const sources = [
    [0.4, "/assets/favicon/2.png"],
    [0.2, "/assets/favicon/3.png"],
    [0.4, "/assets/favicon/1.png"],
].sort((a, b) => {
    let favicon1 = a;
    let favicon2 = b;
    return favicon1[0] - favicon2[0];
});
const favicon = document.getElementById("favicon");
let random = Math.random();
let probabilitySum = 0;
for (let i = 0; i < sources.length; i++) {
    let faviconData = sources[i];
    probabilitySum += faviconData[0];
    if (random > probabilitySum)
        continue;
    favicon.href = faviconData[1];
    console.log("Favicon:", favicon.href, `(${faviconData[0] * 100}% chance)`);
    break;
}
//# sourceMappingURL=favicon.js.map