import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export class CheckoutOverviewPage extends BasePage {

    readonly title: Locator;
    readonly finishButton: Locator;

    constructor(page: Page) {
        super(page);
        this.title = page.getByTestId('title');
        this.finishButton = page.getByTestId('finish');
    }

    // Requires a user to be logged in first
    async goTo(): Promise<void> {
        await this.page.goto(this.baseURL + '/checkout-step-two.html');
        await this.visible();
    }

    async visible(): Promise<void> {
        await expect(this.title).toBeVisible();
        await expect(this.title).toContainText('Checkout: Overview');
    }

    async completeCheckout(): Promise<void> {
        await this.finishButton.click();
    }

}