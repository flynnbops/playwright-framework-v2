import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./basePage";
import { Product } from "../data/product";
import { Checkout } from "../data/checkout";

export class CheckoutPage extends BasePage {

    readonly title: Locator;
    readonly cartItems: Locator;
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly zipCodeField: Locator;
    readonly submitButton: Locator;
    readonly formContainer: Locator;

    constructor(page: Page) {
        super(page);
        this.title = page.getByTestId('title');
        this.firstNameField = page.getByTestId('firstName');
        this.lastNameField = page.getByTestId('lastName');
        this.zipCodeField = page.getByTestId('postalCode');
        this.submitButton = page.getByTestId('continue');
        this.formContainer = page.getByTestId('checkout-info-container');
    }

    // Requires a user to be logged in first
    async goTo(): Promise<void> {
        await this.page.goto(this.baseURL + '/checkout-step-one.html');
        await this.visible();
    }

    async visible(): Promise<void> {
        await expect(this.title).toBeVisible();
        await expect(this.title).toContainText('Checkout: Your Information');
    }

    async expectProductToBeVisible(product: Product): Promise<void> {
        await expect(this.cartItems).toContainText(product.name);
    }

    async fillInCheckoutDetails(details: Checkout): Promise<void> {
        await expect(this.formContainer).toBeVisible();
        await this.firstNameField.fill(details.firstName);
        await this.lastNameField.fill(details.lastName);
        await this.zipCodeField.fill(details.zipCode);
        await this.submitButton.click();
    }
}