const createApiAppendedString = (version) => (string) => `/api${version}${string}`;

const createV1ApiString = createApiAppendedString("/v1");

module.exports = {createV1ApiString};