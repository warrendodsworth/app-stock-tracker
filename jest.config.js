/**
 * https://jestjs.io/docs/configuration
 * https://www.amadousall.com/how-to-set-up-angular-unit-testing-with-jest/
 *
 * simpler use = ng add @briebug/jest-schematic
 *
 * --runInBand https://stackoverflow.com/questions/65907608/firebase-emulator-leaking-when-using-with-jest
 */

// ts not working - jest searches for a js config file
// import type { Config } from '@jest/types';
// : Config.InitialOptions
// export default config

// Ionic 6 https://ionicframework.com/docs/intro/upgrading-to-ionic-6#testing

module.exports = {
  verbose: false, // prints each it(name)
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  // custom
  // rootDir: 'src',
  testPathIgnorePatterns: ['lib/', 'node_modules/', 'util/', 'setup/'],
  // testEnvironment: 'node',

  transformIgnorePatterns: ['/node_modules/(?!@ionic/core|@stencil/core|ionicons)'],
};
