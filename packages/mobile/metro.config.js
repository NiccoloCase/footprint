const path = require("path");
const getWorkspaces = require("get-yarn-workspaces");
const blacklist = require("metro-config/src/defaults/blacklist");

const workspaces = getWorkspaces(__dirname);

module.exports = {
  projectRoot: path.resolve(__dirname, "."),

  watchFolders: [path.resolve(__dirname, "../../node_modules"), ...workspaces],

  resolver: {
    blacklistRE: blacklist(
      workspaces.map(
        (workspacePath) =>
          `/${workspacePath.replace(
            /\//g,
            "[/\\\\]",
          )}[/\\\\]node_modules[/\\\\]react-native[/\\\\].*/`,
      ),
    ),
    extraNodeModules: {
      "react-native": path.resolve(__dirname, "node_modules/react-native"),
      //react: path.resolve(__dirname, "../../node_modules/react"),
    },
  },
};

/* const path = require('path');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          return path.resolve(__dirname, `node_modules/${name}`);
        },
      },
    ),
  },
  watchFolders: [path.resolve(__dirname, '../')],
};
 */
