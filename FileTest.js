module.exports = class FileTest {
	constructor(filename) {
		this.filename = filename;
	}

	getPath() {
		return this.filename;
	}
}