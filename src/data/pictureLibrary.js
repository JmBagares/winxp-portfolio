const pictureModules = import.meta.glob('../assets/bg/*.{png,jpg,jpeg,webp,gif,bmp,avif}', {
  eager: true,
  import: 'default',
  query: '?url',
});

const iconModules = import.meta.glob('../assets/*.ico', {
  eager: true,
  import: 'default',
  query: '?url',
});

const humanizeName = (value) => value
  .replace(/\.[^.]+$/, '')
  .replace(/[-_]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getBaseName = (fileName) => fileName.replace(/\.[^.]+$/, '');

const getExtension = (fileName) => fileName.split('.').pop()?.toLowerCase() ?? '';

export const pictureLibrary = Object.entries(pictureModules)
  .map(([assetPath, src]) => {
    const originalFileName = assetPath.split('/').pop() ?? assetPath;
    const extension = getExtension(originalFileName);

    return {
      id: originalFileName,
      src,
      originalFileName,
      defaultDisplayName: humanizeName(originalFileName),
      extension,
      fileType: extension ? `${extension.toUpperCase()} Image` : 'Image File',
      fakePath: `C:\\Documents and Settings\\Jan\\My Documents\\My Pictures\\${originalFileName}`,
      baseName: getBaseName(originalFileName),
    };
  })
  .sort((firstPicture, secondPicture) => firstPicture.defaultDisplayName.localeCompare(secondPicture.defaultDisplayName));

export const getPicturesFolderIconUrl = () => {
  const iconEntries = Object.entries(iconModules);
  const preferredNames = ['closed.ico', 'folder closed.ico'];

  for (const preferredName of preferredNames) {
    const exactMatch = iconEntries.find(([assetPath]) => assetPath.split('/').pop()?.toLowerCase() === preferredName);

    if (exactMatch) {
      return exactMatch[1];
    }
  }

  const fallbackMatch = iconEntries.find(([assetPath]) => assetPath.toLowerCase().includes('folder'));
  return fallbackMatch?.[1] ?? '';
};