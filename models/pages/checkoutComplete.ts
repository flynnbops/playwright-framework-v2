import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class CheckoutCompletePage extends BasePage {

    readonly title: Locator;
    readonly backHomeButton: Locator;
    readonly completeHeader: Locator

    constructor(page: Page) {
        super(page);
        this.title = page.getByTestId('title');
        this.backHomeButton = page.getByTestId('back-to-products');
        this.completeHeader = page.getByTestId('complete-header');
    }

    // Requires a user to be logged in first
    async goTo(): Promise<void> {
        await this.page.goto(this.baseURL + '/checkout-complete.html');
        await this.visible();
    }

    async visible(): Promise<void> {
        await expect(this.title).toBeVisible();
        await expect(this.title).toContainText('Checkout: Complete!');
    }

}