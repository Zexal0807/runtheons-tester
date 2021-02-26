module.exports = class Test {
	name;
	url;
	method;
	headers;
	body;
	aspectedResponse;

	costruction(obj) {
		this.name = name || "";
		this.url = obj.url || "/";
		this.method = obj.method || "GET";
		this.headers = obj.headers || [];
		if (this.headers['Content-Type'] == undefined) {
			this.headers['Content-Type'] = "application/json";
		}
		this.body = obj.body || {}
		this.aspectedResponse = obj.response || { status: true };
	}

	test(request) {
		it(this.name, async done => {
			var method = this.method;
			const response = await request[method](this.url)
				.set(this.headers)
				.send(this.body);

			expect(response.body.status).toEqual(this.aspectedResponse.status);
			done();
		});
	}
}