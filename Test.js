const request = require("request-promise");
const FileTest = require("./FileTest");
const fs = require("fs");

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

	createForm() {
		var form = {}
		Object.keys(this.body).forEach(k => {
			var v = this.body[k];
			if (v instanceof FileTest) {
				form[k] = fs.createReadStream(v.getPath());
			} else {
				form[k] = v;
			}
		})
		return form;
	}

	async test(requested) {
		var options = {
			method: this.method,
			uri: "http://localhost:3001" + this.url,
			headers: this.header,
			resolveWithFullResponse: true,
			json: true
		};

		var haveFile = Object.values(this.body).find(el => el instanceof FileTest) != undefined;
		if (haveFile) {
			options.formData = this.createForm();
		} else {
			options.body = this.body;
		}

		var objTest = {
			name: this.name,
			duration: this.getNanoSecTime(),
			method: this.method,
			url: this.url,
			body: this.body,
			header: this.header,
			status: true
		};

		return new Promise((resolve, reject) => {
			request(options)
				.then(response => {
					objTest.duration = (this.getNanoSecTime() - objTest.duration) / 1000000;
					objTest.response = {
						body: response.body,
						header: response.header
					}
					if (response.body.status == this.aspectedResponse.status) {
						objTest.status = true;
					} else {
						console.log(response);
						objTest.status = false;
					}
					return resolve(objTest)
				})
				.catch(err => {
					objTest.duration = (this.getNanoSecTime() - objTest.duration) / 1000000;
					//console.log(err);
					return resolve(objTest)
				});
		});
	}

	getNanoSecTime() {
		var hrTime = process.hrtime();
		return hrTime[0] * 1000000000 + hrTime[1];
	}
}