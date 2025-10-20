import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./basePage";
import { Product } from "../data/product";

export class ProductPage extends BasePage {

    readonly title: Locator;
    readonly productName: Locator;
    readonly description: Locator;
    readonly price: Locator;
    readonly addToCartButton: Locator;
    readonly removeFromCartButton: Locator;
    readonly cartIcon: Locator;

    constructor(page: Page) {
        super(page);
        this.title = page.getByTestId('back-to-products')
        this.productName = page.getByTestId('inventory-item-name');
        this.description = page.getByTestId('inventory-item-desc');
        this.price = page.getByTestId('inventory-item-price');
        this.addToCartButton = page.getByTestId('add-to-cart');
        this.removeFromCartButton = page.getByTestId('remove');
        this.cartIcon = page.getByTestId('shopping-cart-badge');
    }

    // Requires a user to be logged in first
    async goTo(productID: number): Promise<void> {
        await this.page.goto(this.baseURL + `/inventory-item.html?id=${productID}`);
        await this.visible();
    }

    async visible(): Promise<void> {
        await expect(this.title).toBeVisible();
        await expect(this.title).toContainText('Back to products');
    }

    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
        await expect(this.removeFromCartButton).toBeVisible();
    }

    async expectCartToShowCount(count: string): Promise<void> {
        await expect(this.cartIcon).toContainText(count);
    }

    async getPageDetails(): Promise<Product> {
        const actualProduct: Product = {} as Product;

        actualProduct.id = Number(this.page.url().split('=')[1]);
        actualProduct.name = String(await this.productName.allTextContents());
        actualProduct.description = String(await this.description.allTextContents());
        actualProduct.price = Number((await this.price.allTextContents())[0].split('$')[1]);

        return actualProduct;
    }
}