const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// Configuration monorepo
config.projectRoot = __dirname;
config.watchFolders = [__dirname];

// Configuration resolver
config.resolver.platforms = ["ios", "android", "native", "web"];
config.resolver.unstable_enableSymlinks = false;

// Configuration Metro
config.watchman = false;

module.exports = config;
