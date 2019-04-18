# Code source documentation

[TPI documentation](../README.md)

This project is a backend project that is in interaction with the database.
It consist of a Node.js http server application, built upon the _[koa](https://koajs.com/ "next generation web framework for node.js")_ web framework and written in Javascript.

## Available scripts

The scripts are contained into the [package.json](./package.json) file. They are:

* Run
  * `npm start` to launch the server app, with watch mode and hot reload.
* Lint: `npm run lint`
* Automated Tests
  * `npm test` to run all the test.
  * `npm test:unit` to run unit tests.
  * `npm test:unit:watch` to run unit tests in watch mode.
* Technical Documentation
  * Generate code source documentation: `npm run doc:code` - Generate HTML documentation from code source comments into [docs/html](docs/html) folder.
  * Generate API documentation: `npm run doc:api` - Generate and validate a [yaml file](docs/api/eagle-api.yml) that contains the documentation. Use online [swagger-editor](https://editor.swagger.io/) to see the content..
