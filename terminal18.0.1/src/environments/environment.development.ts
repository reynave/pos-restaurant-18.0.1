import { version } from '../version';
declare var server: string;
declare var api: string;
declare var lisence: string;

export const environment = {
    ver: version.version + '-' + version.buildTime,
    production: true,
    api : api,
    server : server,
    client : lisence
};
