'use strict';

 //import APIs
const loopback = require('loopback');
const promisify = require('util').promisify;
const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdirp = promisify(require('mkdirp'));

const DATASOURCE_NAME = 'testLoopback';//the datasource name we need to discover
const dataSourceConfig = require('./server/datasources.json');
const db = new loopback.DataSource(dataSourceConfig[DATASOURCE_NAME]);

discover().then(
  success => process.exit(),
  error => { console.error('UNHANDLED ERROR:\n', error); process.exit(1); },
);

async function discover() {
  // It's important to pass the same "options" object to all calls
  // of dataSource.discoverSchemas(), it allows the method to cache
  // discovered related models
  const options = {relations: true};//this is required to discover related schemas

  // Discover models and relations
  const empSchema = await db.discoverSchemas('employee', options);//employee is the name of the table, if multiple schemas then specify schema name also as public.employee
   console.log(empSchema);
  // Create model definition files
  await mkdirp('common/models');
  await writeFile(
    'common/models/employee.json',
    JSON.stringify(empSchema['public.employee'], null, 2)//get the details for the public.employee schema
  );

  // Expose models via REST API
  const configJson = await readFile('server/model-config.json', 'utf-8');
  console.log('MODEL CONFIG', configJson);
  const config = JSON.parse(configJson);
  config.Employee = {dataSource: DATASOURCE_NAME, public: true};
  await writeFile(
    'server/model-config.json',
    JSON.stringify(config, null, 2)
  );
}
