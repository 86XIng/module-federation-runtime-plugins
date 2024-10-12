# runtime-external-remotes-plugin
<p>
  <a href="https://npmjs.com/package/runtime-external-remotes-plugin?activeTab=readme"><img src="https://img.shields.io/npm/v/runtime-external-remotes-plugin?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" /></a>
</p>

This plugin is inspired by Zackary Jackson's [ExternalTemplateRemotesPlugin](https://www.npmjs.com/package/external-remotes-plugin)
and it was adapted to work with [@module-federation/enhanced](https://github.com/module-federation/core) and [Rsbuild](https://github.com/web-infra-dev/rsbuild).



**Installation**

```shell
$ npm i runtime-external-remotes-plugin
```

**Host webpack.config**
```js
const config = {
  // ...otherConfigs
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      remotes: {
        app2: "app2@[window.app2Url]/remoteEntry.js",
        'my-remote-1': 'my-remote-1@[window.remote-1-domain]/remoteEntry.js?[window.getRandomString()]',
        // ...
      },
      runtimePlugins:[require.resolve('runtime-external-remotes-plugin')]
    })
  ]
}
```

**or rsbuild.config**
```js
defineConfig({
  // ...otherConfigs
  moduleFederation: {
    options: {
        name: "app1",
        remotes: {
            app2: "app2@[window.app2Url]/remoteEntry.js",
            'my-remote-1': 'my-remote-1@[window.remote-1-domain]/remoteEntry.js?[window.getRandomString()]',
            // ...
        },
        runtimePlugins:[require.resolve('runtime-external-remotes-plugin')]
    }
  }
})
```


**Host (app1) source somewhere before loading main entry file**
```js
window.app2Url = "//localhost:3002"; // Whatever the url/logic to determine your remote module is
window['remote-1-domain'] = "//localhost:3003";
window.getRandomString = function (){
    return ...
}

import("./bootstrap");
```

