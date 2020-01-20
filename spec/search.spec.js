import test from "ava";
import puppeteer from "puppeteer";
import isCI from "is-ci";

let page;
let browser;
const searchBox = ".gLFyf.gsfi";

test.before(async () => {
  browser = !isCI
    ? await puppeteer.launch({ headless: false })
    : await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      });
  page = await browser.newPage();
  await page.goto("https://www.google.com", { waitUntil: "networkidle0" });
});

test.after(() => {
  if (!page.isClosed()) {
    browser.close();
  }
});

test("should be on google search page", async t => {
  await page.waitFor(searchBox);

  const title = await page.title();
  t.is(title, "Google");
});

test("should search for Cheese!", async t => {
  t.true(!!(await page.$(searchBox)));

  await page.type(searchBox, "Cheese!", { delay: 100 });
  await page.keyboard.press("\n");
});

test('the page title should start with "Cheese!', async t => {
  await page.waitFor("#resultStats");

  const title = await page.title();
  const words = title.split(" ");
  t.is(words[0], "Cheese!");
});
