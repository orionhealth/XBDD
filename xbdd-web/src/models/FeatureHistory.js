import BuildResult from './BuildResult';

export default class FeatureHistory {
  constructor(featureHistory) {
    this.builds = featureHistory.rollup.map(
      element =>
        new BuildResult({
          buildNumber: element.build,
          calculatedStatus: element.calculatedStatus,
          originalAutomatedStatus: element.originalAutomatedStatus,
          statusLastEditedBy: element.statusLastEditedBy,
        })
    );
  }
}
