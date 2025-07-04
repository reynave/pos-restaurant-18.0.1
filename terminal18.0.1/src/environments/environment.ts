import packageJson from '../../package.json';
declare var server: string;
declare var api: string;
declare var lisence: string;

export const environment = {
    ver: packageJson.version,
    production: true,
    api : api,
    server : server,
    client : lisence
};
