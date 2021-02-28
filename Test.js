const expect = require('expect');

module.exports = class Test {

	constructor(obj) {
		this.name = obj.name || "";
		this.url = obj.url || "/";
		this.method = obj.method || "GET";
		this.method = this.method.toLowerCase();
		this.header = obj.header || [];
		if (this.header['Content-Type'] == undefined && this.method != "GET") {
			this.header['Content-Type'] = "application/json";
		}
		this.body = obj.body || {}
		this.aspectedResponse = obj.response || { status: true };
	}

	async test(request) {
		var objTest = {
			duration: this.getNanoSecTime(),
			method: this.method,
			url: this.url,
			body: this.body,
			header: this.header,
			status: true
		};

		const response = await request[objTest.method](this.url)
			.set(this.header)
			.send(this.body);

		objTest.response = {
			body: response.body,
			header: response.header
		}

		try {
			await expect(response.body.status).toEqual(this.aspectedResponse.status);
		} catch (e) {
			objTest.status = false;
			objTest.error = e;
		}
		objTest.duration = (this.getNanoSecTime() - objTest.duration) / 1000000;
		return objTest;
	}

	getNanoSecTime() {
		var hrTime = process.hrtime();
		return hrTime[0] * 1000000000 + hrTime[1];
	}
}