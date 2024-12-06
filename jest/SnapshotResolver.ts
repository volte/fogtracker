const snapshotResolver = {
  resolveSnapshotPath: (testPath: string, snapshotExtension: string) => {
    // Resolve the snapshot path to the corresponding path under the snapshots directory
    return testPath.replace('src/', 'jest/snapshots/') + snapshotExtension;
  },

  resolveTestPath: (snapshotFilePath: string, snapshotExtension: string) => {
    // Resolve the test path to the corresponding path under the src directory
    return snapshotFilePath
      .replace('snapshots/', 'src/')
      .slice(0, -snapshotExtension.length);
  },

  testPathForConsistencyCheck: 'src/folder1/folder2/example.test.ts'
};

export default snapshotResolver;
