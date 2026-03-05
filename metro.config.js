const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure EXPO_OS is defined for babel transformation
if (typeof process.env.EXPO_OS === 'undefined') {
  process.env.EXPO_OS = 'android';
}

module.exports = config;
