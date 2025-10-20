export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
}

const backpack: Product = {
    id: 4,
    name: 'Sauce Labs Backpack',
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    price: 29.99
}

const bikeLight: Product = {
    id: 0,
    name: 'Sauce Labs Bike Light',
    description: "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
    price: 9.99
}

// This is a record of products that can be used in tests.
// If I had more control of the application I would create a product for each test.
// For now, I will use the existing products in the application.
// This approach keeps the data details abstracted away from the test implementation, regardless of how data is created or managed.
export const products: Record<string, Product> = {
    'backpack': backpack,
    'bikeLight': bikeLight
}