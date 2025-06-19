import packageJson from '../../package.json';
declare var server: string;
declare var api: string;

export const environment = {
    ver: packageJson.version,
    production: false,
    api : api,
    server : server
};
