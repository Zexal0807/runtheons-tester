module.exports = (filename) => new class FileTest {
	constructor(filename) {
		this.filename;
	}
	getPath() {
		return this.filename;
	}
}(filename);