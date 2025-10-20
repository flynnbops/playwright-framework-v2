import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./basePage";
import { Product } from "../data/product";

export class CartPage extends BasePage {

    readonly title: Locator;
    readonly cartItems: Locator;
    readonly checkoutButton: Locator;
    readonly inventoryItem: Locator;

    constructor(page: Page) {
        super(page);
        this.title = page.getByTestId('title');
        this.inventoryItem = page.getByTestId('inventory-item');
        this.checkoutButton = page.getByTestId('checkout');
    }

    // Requires a user to be logged in first
    async goTo(): Promise<void> {
        await this.page.goto(this.baseURL + '/cart.html');
        await this.visible();
    }

    async visible(): Promise<void> {
        await expect(this.title).toBeVisible();
        await expect(this.title).toContainText('Your Cart');
    }

    async expectProductToBeVisible(product: Product): Promise<void> {
        await expect(this.inventoryItem).toContainText(product.name);
    }
}