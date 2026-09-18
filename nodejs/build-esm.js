const fs = require('fs');
const path = require('path');

const esmContent = `import cjs from './index.js';

export const BurkutClient = cjs.BurkutClient;
export const BurkutError = cjs.BurkutError;
export const AuthenticationError = cjs.AuthenticationError;
export const ForbiddenError = cjs.ForbiddenError;
export const NotFoundError = cjs.NotFoundError;
export const RateLimitError = cjs.RateLimitError;
export const QuotaExceededError = cjs.QuotaExceededError;
export const ServerError = cjs.ServerError;
export const NetworkError = cjs.NetworkError;
export const StocksResource = cjs.StocksResource;
export const ForexResource = cjs.ForexResource;
export const GoldResource = cjs.GoldResource;
export const FundsResource = cjs.FundsResource;
export const BondsResource = cjs.BondsResource;
export const ViopResource = cjs.ViopResource;

export default cjs;
`;

const distDir = path.join(__dirname, 'dist');
fs.writeFileSync(path.join(distDir, 'index.mjs'), esmContent, 'utf8');
console.log('Successfully generated dist/index.mjs for ESM compatibility');
