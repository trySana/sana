const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Support for SVG
config.transformer.assetPlugins = ["expo-asset/tools/hashAssetFiles"];

// Support for react-native-reanimated
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
