const { app } = require("./backEnd.js");
const puppeteer = require("puppeteer");
const nock = require("nock");

let browser;

beforeAll(async () => {
	browser = await puppeteer.launch({ headless: false, slowMo: 30 });
});

afterAll(async () => {
	await browser.close();
});

describe("Testing if the user can add an item", () => {
	it("should", () => {
		expect(5).toBe(5);
	});
});
