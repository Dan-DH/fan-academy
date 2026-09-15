import "../../chunks/server.js";
//#region src/routes/+page.svelte
function _page($$renderer) {
	$$renderer.push(`<h1 class="text-4xl">hello</h1>`);
}
//#endregion
export { _page as default };
