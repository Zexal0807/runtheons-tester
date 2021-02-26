module.exports = class Test {

	constructor(obj) {
		this.name = obj.name || "";
		this.url = obj.url || "/";
		this.method = obj.method || "GET";
		this.header = obj.header || [];
		if (this.header['Content-Type'] == undefined && this.method != "GET") {
			this.header['Content-Type'] = "application/json";
		}
		this.body = obj.body || {}
		this.aspectedResponse = obj.response || { status: true };
	}

	async test(request) {
		var method = this.method.toLowerCase();
		const response = await request[method](this.url)
			.set(this.header)
			.send(this.body);

		const expect = require('expect');
		expect(response.body.status).toEqual(this.aspectedResponse.status)
	}
}