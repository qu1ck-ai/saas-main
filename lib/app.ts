import packageInfo from '../package.json';
import env from './env';

const app = {
  version: packageInfo.version,
  name: 'Qu1ck',
  logoUrl: 'https://paginaqu1ck.netlify.app/assets/logo.png',
  url: env.appUrl,
};

export default app;
