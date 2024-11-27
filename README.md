# Serverless Lambda Layer NPM Installer

Simple [Serverless][url-serverless] plugin for auto-installing node packages required in Lambda layers before packaging and deployment.

[![serverless][icon-serverless]][url-serverless]
[![license][icon-license]][path-license]
[![npm][icon-npm]][url-npm]

## Installation
**Install via Serverless**
```shell
serverless plugin install -n serverless-lambda-layer-npm-installer
```

**Install via NPM**

Install the plugin via NPM:
```shell
npm install --save-dev serverless-lambda-layer-npm-installer
```
Then register it in the `plugin` section of `servereless.yml`:
```yaml
# serverless.yml file

plugins:
  - serverless-lambda-layer-npm-installer
```

## Usage
When running `serverless package`, `serverless deploy` or `serverless deploy function`,
`npm install` will be run on directories of Lambda layers defined in `serverless.yml`.

[url-serverless]: https://www.serverless.com
[url-npm]: https://www.npmjs.com/package/serverless-lambda-layer-npm-installer
[path-license]: ./LICENSE
[icon-serverless]: http://public.serverless.com/badges/v3.svg
[icon-license]: https://img.shields.io/npm/l/serverless-lambda-layer-npm-installer
[icon-npm]: https://img.shields.io/npm/v/serverless-lambda-layer-npm-installer