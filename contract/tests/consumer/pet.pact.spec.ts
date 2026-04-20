/**
 * Pact Consumer Contract Tests — GET /pet
 *
 * Covers:
 *   - GET /pet/findByStatus   (operationId: findPetsByStatus)
 *   - GET /pet/{petId}        (operationId: getPetById)
 *
 * Contract source: contracts/petstore.yaml
 * Pact output:     contracts/pacts/
 *
 * Run via:  npx playwright test contracts/pet.pact.spec.ts --project=contract
 */

const { test, expect } = require('@playwright/test');
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const path = require('path');

const { eachLike, integer, regex } = MatchersV3;

// ---------------------------------------------------------------------------
// Shared Pact provider — one mock server for all interactions in this file
// ---------------------------------------------------------------------------
const provider = new PactV3({
  consumer: 'PlaywrightPetstoreConsumer',
  provider: 'PetstoreAPI',
  dir: path.resolve(__dirname, '../../pacts'),
  logLevel: 'warn',
});

// ---------------------------------------------------------------------------
// Reusable response body matchers derived from the OpenAPI Pet schema
// ---------------------------------------------------------------------------
const petResponseBody = {
  id: integer(),
  name: regex(/^.+$/, 'doggie'),
  photoUrls: eachLike(regex(/^https?:\/\/[\w-]+(\.[\w-]+)+(\/[\w\-./?%&=]*)?$/, 'https://example.com/photo.jpg')),
  status: regex(/^(available|pending|sold)$/, 'available'),
};

// ---------------------------------------------------------------------------
// GET /pet/findByStatus
// ---------------------------------------------------------------------------
test.describe('GET /pet/findByStatus contract', { tag: ['@contract', '@api', '@pet'] }, () => {

  test('returns a list of available pets — 200', async () => {
    await provider.addInteraction({
      states: [{ description: 'at least one available pet exists' }],
      uponReceiving: 'a request to find pets by status=available',
      withRequest: {
        method: 'GET',
        path: '/api/v3/pet/findByStatus',
        query: { status: 'available' },
        headers: { Accept: 'application/json' },
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: eachLike(petResponseBody),
      },
    });

    await provider.executeTest(async (mockServer) => {
      const response = await fetch(
        `${mockServer.url}/api/v3/pet/findByStatus?status=available`,
        { headers: { Accept: 'application/json' } }
      );

      expect(response.status).toBe(200);

      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);

      const pet = body[0];
      expect(typeof pet.name).toBe('string');
      expect(Array.isArray(pet.photoUrls)).toBe(true);
    });
  });

  test('returns a list of pending pets — 200', async () => {
    await provider.addInteraction({
      states: [{ description: 'at least one pending pet exists' }],
      uponReceiving: 'a request to find pets by status=pending',
      withRequest: {
        method: 'GET',
        path: '/api/v3/pet/findByStatus',
        query: { status: 'pending' },
        headers: { Accept: 'application/json' },
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: eachLike(petResponseBody),
      },
    });

    await provider.executeTest(async (mockServer) => {
      const response = await fetch(
        `${mockServer.url}/api/v3/pet/findByStatus?status=pending`,
        { headers: { Accept: 'application/json' } }
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
    });
  });

  test('returns a list of sold pets — 200', async () => {
    await provider.addInteraction({
      states: [{ description: 'at least one sold pet exists' }],
      uponReceiving: 'a request to find pets by status=sold',
      withRequest: {
        method: 'GET',
        path: '/api/v3/pet/findByStatus',
        query: { status: 'sold' },
        headers: { Accept: 'application/json' },
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: eachLike(petResponseBody),
      },
    });

    await provider.executeTest(async (mockServer) => {
      const response = await fetch(
        `${mockServer.url}/api/v3/pet/findByStatus?status=sold`,
        { headers: { Accept: 'application/json' } }
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
    });
  });

  test('returns 400 for an invalid status value', async () => {
    await provider.addInteraction({
      states: [{ description: 'the API is running' }],
      uponReceiving: 'a request to find pets with an invalid status',
      withRequest: {
        method: 'GET',
        path: '/api/v3/pet/findByStatus',
        query: { status: 'invalid_status' },
        headers: { Accept: 'application/json' },
      },
      willRespondWith: {
        status: 400,
      },
    });

    await provider.executeTest(async (mockServer) => {
      const response = await fetch(
        `${mockServer.url}/api/v3/pet/findByStatus?status=invalid_status`,
        { headers: { Accept: 'application/json' } }
      );

      expect(response.status).toBe(400);
    });
  });
});

// ---------------------------------------------------------------------------
// GET /pet/{petId}
// ---------------------------------------------------------------------------
test.describe('GET /pet/{petId} contract', { tag: ['@contract', '@api', '@pet'] }, () => {

  test('returns a single pet for a valid petId — 200', async () => {
    const petId = 10;

    await provider.addInteraction({
      states: [{ description: `pet with id ${petId} exists` }],
      uponReceiving: `a request to get pet with id ${petId}`,
      withRequest: {
        method: 'GET',
        path: `/api/v3/pet/${petId}`,
        headers: { Accept: 'application/json' },
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          ...petResponseBody,
          id: integer(petId),
        },
      },
    });

    await provider.executeTest(async (mockServer) => {
      const response = await fetch(
        `${mockServer.url}/api/v3/pet/${petId}`,
        { headers: { Accept: 'application/json' } }
      );

      expect(response.status).toBe(200);

      const body = await response.json();
      expect(typeof body.id).toBe('number');
      expect(typeof body.name).toBe('string');
      expect(Array.isArray(body.photoUrls)).toBe(true);
      expect(['available', 'pending', 'sold', undefined]).toContain(body.status);
    });
  });

  test('returns 404 when the petId does not exist', async () => {
    const missingPetId = 999999;

    await provider.addInteraction({
      states: [{ description: `pet with id ${missingPetId} does not exist` }],
      uponReceiving: `a request to get a non-existent pet with id ${missingPetId}`,
      withRequest: {
        method: 'GET',
        path: `/api/v3/pet/${missingPetId}`,
        headers: { Accept: 'application/json' },
      },
      willRespondWith: {
        status: 404,
      },
    });

    await provider.executeTest(async (mockServer) => {
      const response = await fetch(
        `${mockServer.url}/api/v3/pet/${missingPetId}`,
        { headers: { Accept: 'application/json' } }
      );

      expect(response.status).toBe(404);
    });
  });

  test('returns 400 for a non-integer petId', async () => {
    await provider.addInteraction({
      states: [{ description: 'the API is running' }],
      uponReceiving: 'a request to get a pet with a non-integer id',
      withRequest: {
        method: 'GET',
        path: '/api/v3/pet/not-a-number',
        headers: { Accept: 'application/json' },
      },
      willRespondWith: {
        status: 400,
      },
    });

    await provider.executeTest(async (mockServer) => {
      const response = await fetch(
        `${mockServer.url}/api/v3/pet/not-a-number`,
        { headers: { Accept: 'application/json' } }
      );

      expect(response.status).toBe(400);
    });
  });
});
