const { app } = require("./backEnd.js");
const puppeteer = require("puppeteer");
const nock = require("nock");
const useNock = require("nock-puppeteer");

const URL = "C:/Users/kosta/Code Projcets/FullStackTask-Amit/index.html";
const mockResponse = "success";

let browser, page;
jest.setTimeout(20000);

beforeAll(async () => {
	browser = await puppeteer.launch({
		headless: false,
		args: ["--disable-web-security"],
		slowMo: 30,
	});
	page = await browser.newPage();
	await page.goto(URL, { waitUntil: "networkidle0" });

	useNock(page, ["http://localhost:3000"]);
});

afterAll(async () => {
	await browser.close();
});

describe("Testing if the user can add an item", () => {
	it("should", async () => {
		nock("http://localhost:3000")
			.get(/.*/)
			.reply(200, [
				{
					id: "1",
					name: "kotej",
				},
				{
					id: "2",
					name: "tomato",
				},
				{
					id: "3",
					name: "milk",
				},
			]);
		nock("http://localhost:3000")
			.post(/.*/, {
				id: "4",
				name: "kosta",
			})
			.reply(200, { id: "4", name: "kosta" });

		await page.click("input");
		await page.type("input", "kosta");
		await page.click("button#add");
		await page.waitForSelector(".item");

		const itemText = await page.$eval("#product4 > span", (item) => item.textContent);
		expect(itemText).toBe("kosta");
	});
});

/* const numberOfItems = await page.$$eval(".item", (items) => {
			items.length;
		}); */
