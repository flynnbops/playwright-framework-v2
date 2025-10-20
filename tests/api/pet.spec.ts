import test, { expect } from "@playwright/test";
import { Pet, PetSchema, simplePet } from "../../models/api/pet";

test.describe('Edit a pet', { tag: ['@api', '@post', '@pet', '@put', '@delete'] }, () => {

    let pet: Pet;

    test.beforeEach('Create a pet for the test', async ({ request }) => {
        const createPet = await request.post('/api/v3/pet', {data: simplePet});
        expect(createPet.ok()).toBeTruthy();
        const result = PetSchema.parse(await createPet.json());  // This will throw if validation fails
        pet = result;
    });

    test.afterEach('Remove the pet we created', async ({ request }) => {
        const deleteRequest = await request.delete(`/api/v3/pet/${pet.id}`);
        expect(deleteRequest.ok()).toBeTruthy();
    });

    test('Edit pet name', async ({ request }) => { 
        // Arrange
        let updatedPet = {...pet}; // Create a copy instead of reference
        updatedPet.name = 'UPDATED Animal';

        // Act
        const updateRequest = await request.put('/api/v3/pet', {data: updatedPet});

        // Assert name is updated
        expect(updateRequest.ok()).toBeTruthy();
        expect((await updateRequest.json()).name).toEqual(updatedPet.name);
    });
});
