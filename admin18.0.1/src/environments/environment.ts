import packageJson from '../../package.json';
declare var api: string;

export const environment = {
    ver: packageJson.version,
    production: true,
    api : 'http://localhost:3000/',
};
