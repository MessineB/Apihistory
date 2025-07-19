require('dotenv').config({ path: '.env.riot' });

/** @type {import("jest").Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
