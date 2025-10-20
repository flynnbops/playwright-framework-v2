import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./basePage";
import { User } from "../data/user";

export class SauceLoginPage extends BasePage {
    readonly title: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        super(page);
        this.title = page.getByRole('heading', { name: 'Swag Labs' });
        this.usernameInput = page.getByTestId('username');
        this.passwordInput = page.getByTestId('password');
        this.loginButton = page.getByTestId('login-button');
    }

    async goTo(): Promise<void> {
        await this.page.goto(this.baseURL);
        await this.visible();
    }

    async visible(): Promise<void> {
        // I'd prefer to use the title locator, but it is slighty differnet in 
        // the cloud version of the app, so making a compromise here.
        await expect(this.usernameInput).toBeVisible();
    }

    async login(user: User): Promise<void> {
        await this.usernameInput.fill(user.username);
        await this.passwordInput.fill(user.password);
        await this.loginButton.click();
    }
}