import { Page } from 'playwright';

export default class BasePage {

    protected page: Page;
    protected baseURL = String(process.env.SAUCELABS_URL).includes('saucedemo.com')
        ? `${process.env.SAUCELABS_URL}`
        : `${process.env.SAUCELABS_URL}:${process.env.SAUCELABS_PORT}`;

    constructor(page: Page) {
        this.page = page;
    }
}