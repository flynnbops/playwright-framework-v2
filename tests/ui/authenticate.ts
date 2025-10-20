import { test as setup } from '@playwright/test';
import { SauceLoginPage } from '../../models/pages/sauceLogin'
import { ProductsPage } from '../../models/pages/products';
import { User } from '../../models/data/user';

const standardUserAuth = 'playwright/.auth/standard-user.json';

const standardUser: User = {
    username: String(process.env.STANDARDUSER_EMAIL),
    password: String(process.env.STANDARDUSER_PASSWORD)
};

setup('authenticate as standard user', async ({ page }) => {
    let loginPage = new SauceLoginPage(page);
    let productsPage = new ProductsPage(page);

    await loginPage.goTo();
    await loginPage.login(standardUser);
    await productsPage.visible();

    await page.context().storageState({ path: standardUserAuth });
});