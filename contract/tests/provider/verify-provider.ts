import path from 'path';
import { fileURLToPath } from 'url';
import { Verifier } from '@pact-foundation/pact';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const opts = {
//   providerBaseUrl: 'http://localhost:5999',
  providerBaseUrl: 'https://petstore3.swagger.io',
  pactUrls: [path.resolve(__dirname, '../../pacts/PlaywrightPetstoreConsumer-PetstoreAPI.json')],
  publishVerificationResult: false,
  providerVersion: '1.0.0',
  provider: 'PetstoreAPI',
  consumer: 'PlaywrightPetstoreConsumer',
};

new Verifier(opts)
  .verifyProvider()
  .then(output => {
    console.log('Pact Verification Complete:', output);
  })
  .catch(error => {
    console.error('Pact Verification Failed:', error);
    process.exit(1);
  });
