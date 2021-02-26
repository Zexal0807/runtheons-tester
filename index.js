const supertest = requiree("supertest");

module.exports = (app) => {
	const request = supertest(app);

	return request;
}