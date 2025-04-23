import packageJson from '../../package.json';

export const environment = {
    ver: packageJson.version,
    production: false,
    api : 'http://localhost/pos/',
};
