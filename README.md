# Playwright framework v2

Spiritual successor to my first [playwright-restful-booker][3] project.

> Purpose: learning more about the Playwright and its capabilities.
 As such some code examples may be incomplete, bad examples, poor practice, or just plain broken. It's all here for my learning and experimentation.

## Quickstart

> If in doubt follow the [Playwright installation documents][1]

1. Install `nodeJS and NPM`
2. Install dependencies `npm install`
3. Install playwright browsers ` npx playwright install`
4. Run UI tests against cloud application `npm run cloud:ui`
5. View report `npx playwright show-report`

### Recommended additional installation
1. Install [Docker][2] to make use of Application and test containers, via `docker compose`.
2. Bring up the stack `docker compose up -d`, this will also run the tests in docker.
3. Shutdown the stack `docker compose down --volumes --remove-orphans`

### Run UI tests

#### From your local machine targeting the Docker compose application

```shell
npm run local:ui
```

#### From your local machine targeting the deployed (cloud) application

```shell
npm run cloud:ui
```

#### Test and application inside Docker compose
```shell
npm run docker-compose:ui
```

### Run API tests

#### From your local machine targeting the Docker compose application

```shell
npm run local:api
```

#### From your local machine targeting the deployed (cloud) application
> Didn't get to finish this and handle timing / race conditions.

```shell
npm run cloud:api
```

#### Test and application inside Docker compose
```shell
npm run docker-compose:ui
```

### Docker only scrpts
The `docker:ui` and `docker:api` scripts are only invoked inside the Docker compose network. It means some tests can be run by default when we bring up the docker compose stack with `docker compose up`. 

## Structure of project
- `/sample-reports`: playwright reports of different test runs, with full trace enabled
- `/models`: holds all test data and models used by tests
- `/tests`: contains the test specs, these specs outline the tests, making use of the models to keep detail abstracted away from test intent
- `.env.*`: easy ways to handle environment variables for this project. Not suitable to manage real credentials
- `/prompts`: holds converations with CoPilot for visibility

While not requested for this exercise. I believe that being able to reliably run tests in many places including CI, is critical. So these elements of the project are **mandatory** as far as I'm concerned.
- `Dockerfile`: to create a Playwright test runner image
- `dockercompose.yml`: allows the test runner and application images to be run via docker compose

## Test Rationale
 
### UI
One end to end journey, which establishes basic patterns. Initial page objects, data models and test structure in place. Which means we can run tests in locally, against a deployed application, and in CI. For CI, I've implemented a Docker with docker compose approach. From previous experience this also helps local development too. Especially if people "just want to run the test easily".

Tests makes use of `storage state` established by the `authenticate` step, which allows us to skip Login for each test. 

#### Next iterations

Implemented with just the standard user here, but easy to expand the pattern for more user types.

Similarly, initial data models use static data and simple types. I'd want to harden this in future and introduce `faker` for dynamic test data.

Make it easier to handle Page Objects and repeated functionality with `fixtures`, saving duplicate code.

#### Next Scenarios
- Multiple different items of varying quantities purchased.
- User types and expected restrictions
- Negative numbers, field validation

#### What would be better at API level?
UI tests should focus on user facing behaviors and key business flows. The `buy an item` UI test covers a wide range of risks, and verifies a user can complete the main goal of the SauceDemo application. Some parts could also be covered by API tests, for granular coverage, or keeping the UI test scope tight. 

- If we can't share auth state, then making an API call to authenticate as part of the UI tests would be another good option.
- Checking different invalid / valid combinations of login credentials would also sit well at API level.
- Verifying some products data, from an API payload rather than UI checks could be a good call, depending on the risks we are mitigating.

### API
Similarly to UI tests, these rely on using models where possible. Test is more atomic, in that it creates and then deletes data used in the test via the before / after hooks. This is not the highest priority test, but is one that allowed me to establish patterns easily. And I can now easily create a Pet to be used in an order flow.

Tests managing their own data effectively is critical to a robust suite.

#### Next iterations
- Randomised data.
- Abstract API details into own classes.
- Implement schema validation with something like Zod.
- Implement retry / timing logic, to handle race conditions. This is more relevant for the cloud application.

#### Next Scenarios
- Place an order
- Invalid values in Ordering
- Invalid values in Pet Creation / edits


[1]: https://playwright.dev/docs/intro#installing-playwright
[2]: https://www.docker.com/get-started/
[3]: https://github.com/flynnbops/playwright-restful-booker
