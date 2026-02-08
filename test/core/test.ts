// export function registerPlugins<
//     T extends readonly (
//         | readonly [PluginCtor<Plugin>]
//         | readonly [PluginCtor<Plugin>, unknown]
//     )[]
// >(
//     plugins: {
//         readonly [K in keyof T]: T[K] extends readonly [infer P]
//         ? P extends PluginCtor<Plugin>
//         ? readonly [P]
//         : T[K]
//         : T[K] extends readonly [infer P, unknown]
//         ? P extends PluginCtor<Plugin>
//         ? readonly [P, ConstructorParameters<P>[0]?]
//         : T[K]
//         : T[K];
//     }
// ): void {
//     // plugins.forEach((item) => {
//     //     const [plugin, config] = item;
//     //     this._pluginService.registerPlugin(plugin, config);
//     // });
// }