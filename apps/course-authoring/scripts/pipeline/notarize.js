import { notarize } from 'electron-notarize';
import { build } from '../../package.json';

exports.default = async function notarizeMacos(context) {
  const { electronPlatformName, appOutDir } = context;

  if (electronPlatformName !== 'darwin') {
    return;
  }

  if (!('APPLE_ID' in process.env && 'APPLE_ID_PASS' in process.env)) {
    console.warn(
      'Skipping notarizing step. APPLE_ID and APPLE_ID_PASS env variables must be set'
    );
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  await notarize({
    appBundleId: build.appId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASS,
  });
};