import React, { Component } from "react";
import { PropTypes } from "prop-types";
import Report from "../../models/Report";
import TagListView from "./TagListView";

class TagListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterStates: {
        passedSelected: true,
        undefinedSelected: true,
        failedSelected: true,
        skippedSelected: true,
      },
      selectedTag: null,
    };
    this.onFilterButtonClick = this.onFilterButtonClick.bind(this);
    this.onSelectTag = this.onSelectTag.bind(this);
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  onFilterButtonClick(stateAttribute) {
    this.setState(prevState =>
      Object.assign(prevState.filterStates, {
        [stateAttribute]: !prevState.filterStates[stateAttribute],
      }));
  }

  onSelectTag(tag) {
    this.setState({
      selectedTag: tag,
    });
  }

  filterTags() {
    const tags = this.props.report.tagList;

    return tags.filter(
      tag =>
        (this.state.filterStates.passedSelected && tag.containsPassed) ||
        (this.state.filterStates.undefinedSelected && tag.containsUndefined) ||
        (this.state.filterStates.failedSelected && tag.containsFailed) ||
        (this.state.filterStates.skippedSelected && tag.containsSkipped)
    );
  }

  render() {
    return (
      <TagListView
        tags={this.filterTags()}
        selectedTag={this.state.selectedTag}
        filterStates={this.state.filterStates}
        onSelectTag={this.onSelectTag}
        onFilterButtonClick={this.onFilterButtonClick}
      />
    );
  }
}

TagListContainer.propTypes = {
  report: PropTypes.instanceOf(Report).isRequired,
};

export default TagListContainer;
