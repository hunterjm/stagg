# Stagg Web UI

Provided by [Stagg.co](https://stagg.co)

Feeling stuck? Feel free to [join our Discord](https://stagg.co/discord/join) and ask for help!

## Supporting Discord Remote Rendering

To prevent code duplication, all Discord Rich View Reports are generated directly from their respective React components. This is achieved by checking for a flag (set via header or url query) at the app level (in `src/_app.tsx`) and passing this flag to each `NextPage` component located in `src/pages/**`. Any page can choose to ignore this flag or acknowledge it by passing the `renderReport` flag to the abstracted `Template` component (`src/components/Template`). The `Template` HOC checks for this `renderReport` flag and directs the child component(s) to either the `ReportTemplate` for Remote Rendering or the `InterfaceTemplate` for rendering as Web UI.

You can use the `.report-hidden` CSS `className` on any element you wish to show in UI but hide for Remote Rendering. As a helpful reminder, this boilerplate can be pasted at the top of any component used for Remote Rendering.

```ts
/*********************************************************************************
 * ============================================================================= *
 * !!!                     ASSET PATHS MUST BE ABSOLUTE                      !!! *
 * ============================================================================= *
 * ie: CORRECT: <img src="http://example.com/image.png" />                       *
 *     INCORRECT: <img src="/image.png" />                                       *
 *********************************************************************************/
```
