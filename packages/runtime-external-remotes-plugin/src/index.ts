import type { FederationRuntimePlugin } from '@module-federation/enhanced/runtime';

export interface RuntimeExternalRemotesPluginOptions {
    /**
     * Default is `true`
     *
     * Module federation plugin will auto add `window.origin` when remote url not start with `http`
     * ```
     * remotes: {
     *      app2: "app2@[window.app2Url]/remoteEntry.js"
     * }
     * ```
     * app2's config will be `http://localhost:port/[window.app2Url]/remoteEntry.js`
     *
     * But sometimes we need to get `app2Url` directed from window,
     * so we need to use `removeOrigin` remove `window.origin`
     */
    removeOrigin: boolean;
}


const RuntimeExternalRemotesPlugin: () => FederationRuntimePlugin = (
    options: RuntimeExternalRemotesPluginOptions = {
        removeOrigin: true,
    },
) => {
    const { removeOrigin } = options;

    return {
        name: 'runtime-external-remotes-plugin',

        beforeRequest: (args) => {
            args.options.remotes.forEach((remote) => {
                if ('entry' in remote) {
                    if (removeOrigin) {
                        remote.entry = remote.entry.replace(
                            window.location.origin + '/',
                            '',
                        );
                    }
                    const urlExpression = toExpression(remote.entry);

                    remote.entry = urlExpression;
                }
            });
            return args;
        },
    };
};

export default RuntimeExternalRemotesPlugin;

/**
 * Port of external-remotes-plugin template resolution
 * Ref: https://github.com/module-federation/external-remotes-plugin/blob/main/index.js
 */
function toExpression(templateUrl: string) {
    const result: string[] = [];
    const current: string[] = [];
    let isExpression = false;
    let invalid = false;
    for (const c of templateUrl) {
        if (c === '[') {
            if (isExpression) {
                invalid = true;
                break;
            }
            isExpression = true;
            if (current.length) {
                result.push(`${current.join('')}`);
                current.length = 0;
            }
        } else if (c === ']') {
            if (!isExpression) {
                invalid = true;
                break;
            }
            isExpression = false;
            if (current.length) {
                const key = current.join('');
                if (typeof window !== 'undefined' && key in window) {
                    const value = eval(`${key}`);
                    result.push(value);
                } else {
                    throw new Error(
                        `"${templateUrl}" does not exist on the global`,
                    );
                }
            }
            current.length = 0;
        } else {
            current.push(c);
        }
    }
    if (isExpression || invalid) {
        throw new Error(`Invalid template URL "${templateUrl}"`);
    }
    if (current.length) {
        result.push(`${current.join('')}`);
    }
    return result.join('');
}
