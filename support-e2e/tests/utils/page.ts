import {BrowserContext, Page} from "@playwright/test";
import {setTestCookies} from "./cookies";

export const setupPage = async (
  page: Page,
  context: BrowserContext,
  baseURL: string = "https://support.theguardian.com",
  pathName: string,
  cookieUserName: string
) => {
  const pageUrl = `${baseURL}${pathName}`;
  const domain = new URL(pageUrl).hostname;
  await setTestCookies(context, cookieUserName, domain);
  await page.goto(pageUrl);
};
