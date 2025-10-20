import { expect, test } from '@playwright/test';
import { products } from '../../models/data/product';
import { ProductPage } from '../../models/pages/product';
import { CartPage } from '../../models/pages/cart';
import { CheckoutPage } from '../../models/pages/checkout';
import { Checkout, genericDetails } from '../../models/data/checkout';
import { CheckoutOverviewPage } from '../../models/pages/checkoutOverview';
import { CheckoutCompletePage } from '../../models/pages/checkoutComplete';

test.describe('Buy a single product as a standard user', { tag: ['@ui', '@standard-user', '@logged-in', '@e2e', '@checkout'] }, () => {
  // For atomic tests, I would want to create (and later delete) a product just for this test
  // but that is not possible with the current setup.
  // Using the products record keeps data details abstracted away from the test implementation.
  let backpackItem = products.backpack;
  
  let backpackProductPage: ProductPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let checkoutDetails: Checkout;
  let checkoutOverviewPage: CheckoutOverviewPage;
  let checkoutCompletePage: CheckoutCompletePage;

  test.beforeEach('Go to the specific product page and verify the product details', async ({ page }) => {
    // Initialize the page objects
    backpackProductPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);
    checkoutDetails = genericDetails

    await backpackProductPage.goTo(backpackItem.id);
    await backpackProductPage.visible();
  });

  test('buy one Sauce Labs Backpack', async ({ }) => {

    await test.step('Verify the product details', async () => {
      const actualProduct = await backpackProductPage.getPageDetails();
      expect(actualProduct, 'Product details are correct').toEqual(backpackItem);
    });

    await test.step('Add a product to cart', async () => {
      await backpackProductPage.addToCart();
      await backpackProductPage.expectCartToShowCount('1');
      await backpackProductPage.cartIcon.click();
      await cartPage.visible();
    });

    await test.step('Review the cart and proceed to checkout', async () => {
      await cartPage.expectProductToBeVisible(backpackItem);
      await cartPage.checkoutButton.click();
      await checkoutPage.visible();
    });
  
    await test.step('Fill in checkout details', async () => {
      await checkoutPage.fillInCheckoutDetails(checkoutDetails);
    });

    await test.step('Confirm the details on the Checkout overview page', async () => {
      await checkoutOverviewPage.visible();
      // In real world test likely would want to verify more things on the page.
    });

    await test.step('Complete the purchase', async () => {
      // In real world test likely would want to verify more things on the page.
      await checkoutOverviewPage.completeCheckout();
      await checkoutCompletePage.visible();
      await expect(checkoutCompletePage.completeHeader).toContainText('Thank you for your order!');
    });

  });
});
