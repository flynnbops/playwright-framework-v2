import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class ProductsPage extends BasePage {

    readonly title: Locator;

    constructor(page: Page) {
        super(page);
        this.title = page.getByTestId('title')
    }

    // Requires a user to be logged in first
    async goTo(): Promise<void> {
        await this.page.goto(this.baseURL + '/inventory.html');
        await this.visible();
    }

    async visible(): Promise<void> {
        await expect(this.title).toBeVisible();
        await expect(this.title).toContainText('Products');
    }
}