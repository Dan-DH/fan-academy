import "../../chunks/server.js";
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	$$renderer.push(`<div class="min-h-screen flex flex-col bg-base-100 text-base-content selection:bg-primary selection:text-primary-content"><main class="flex-1 flex flex-col">`);
	children($$renderer);
	$$renderer.push(`<!----></main></div>`);
}
//#endregion
export { _layout as default };
