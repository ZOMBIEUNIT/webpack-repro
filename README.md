### Webpack 5 goes bang 💥

This repository attempts to demonstrate a minimal repro of the issue that we currently face migrating our project from webpack 4 to 5. Specifically: `__webpack_require__` goes bang attempting to import a library local to our project.

Repository layout (`*` indicates a file output by build/installation):

```
  webpack-repro
* ├── node_modules
  ├── README.md
  ├── package-lock.json
  ├── package.json
  └── packages
      ├── lib
*     │   ├── dist
*     │   │   └── main.js
      │   ├── package.json
      │   ├── src
      │   │   ├── index.js
      │   │   └── utils.js
      │   └── webpack.config.js
      └── web
          ├── dist
          │   ├── index.html
*         │   └── main.js
          ├── node_modules
          │   └── @my-cool-project
          │       └── lib -> ../../../lib
          ├── src
          │   └── index.js
          └── webpack.config.js
```

There are two packages in this monorepo: `web` and `lib`.

- `lib` is a library that exports one function, leftPad.
- `web` is a webpage that `console.log()` a left-padded hello world.

I've tried to replicate the important behaviours of a lerna monorepo in a minimalist way.

- every package has its own directory inside `packages`
- `lib` gets imported, so I've given it a `package.json`
- all dependencies are hoisted to root-level
  - the only dependency is webpack so this doesn't really matter
- `web` depends on `lib` via `@my-cool-project/lib`
  - `web` has a package-local node_modules with a symlink `@my-cool-project/lib` that leads to the `lib` folder
  - _it'd be more realistic if I'd hoisted this symlink to root-level, but making it package-local was an easy way to prevent its being clobbered by the npm install_

Setup instructions:

```bash
# root-level npm install. our only dependencies are the webpack toolchain
npm i
# build lib
cd packages/lib
node ../../node_modules/.bin/webpack
# run the website
cd ../web
node ../../node_modules/.bin/webpack-dev-server
```

Navigate to http://localhost:8080

In Firefox 80.0b3, you should expect to see the following error when `web` attempts to import `lib`:

```
Uncaught TypeError: __webpack_modules__[moduleId] is undefined
    __webpack_require__ http://localhost:8080/main.js:455
    <anonymous> webpack://lib/./src/index.js?:5
    js webpack:///./node_modules/@my-cool-project/lib/dist/main.js?:28
    __nested_webpack_require_3026__ webpack:///./node_modules/@my-cool-project/lib/dist/main.js?:65
    <anonymous> webpack:///./node_modules/@my-cool-project/lib/dist/main.js?:104
    <anonymous> webpack:///./node_modules/@my-cool-project/lib/dist/main.js?:105
    webpackUniversalModuleDefinition webpack:///./node_modules/@my-cool-project/lib/dist/main.js?:11
    <anonymous> webpack:///./node_modules/@my-cool-project/lib/dist/main.js?:13
    node_modules my-cool-project/lib/dist/main.js@http://localhost:8080/main.js:418
    __webpack_require__ http://localhost:8080/main.js:455
    <anonymous> webpack:///./src/index.js?:2
    js http://localhost:8080/main.js:432
    __webpack_require__ http://localhost:8080/main.js:455
    <anonymous> http://localhost:8080/main.js:529
    <anonymous> http://localhost:8080/main.js:532
```

In Chrome 84, you'll get a slightly vaguer message:

```
Uncaught TypeError: Cannot read property 'call' of undefined
    at __webpack_require__ (main.js:455)
    at eval (index.js:5)
    at Object../src/index.js (main.js:28)
    at __nested_webpack_require_3026__ (main.js:65)
    at eval (main.js:104)
    at eval (main.js:105)
    at webpackUniversalModuleDefinition (main.js:11)
    at eval (main.js:13)
    at Object../node_modules/@my-cool-project/lib/dist/main.js (main.js:418)
    at __webpack_require__ (main.js:455)
```

I'm grateful for any insight you can provide on this issue!