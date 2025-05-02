import packageJson from '../../package.json';
declare var api: string;

export const environment = {
    ver: packageJson.version,
    production: false,
   // api : 'http://localhost:3000/',
   api : api,
};
