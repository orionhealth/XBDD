export default class BuildResult {
  constructor(buildResult) {
    this.buildNumber = buildResult.buildNumber;
    this.calculatedStatus = buildResult.calculatedStatus;
    this.originalAutomatedStatus = buildResult.originalAutomatedStatus;
    this.statusLastEditedBy = buildResult.statusLastEditedBy;
  }
}
