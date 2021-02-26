const supertest = require("supertest");

module.exports = (app) => { return supertest(app); }