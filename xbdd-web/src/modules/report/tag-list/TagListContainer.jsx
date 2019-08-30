import React, { Component } from "react";
import { PropTypes } from "prop-types";
import Report from "../../../models/Report";
import TagListView from "./TagListView";

class TagListContainer extends Component {
  constructor(props) {
    super(props);

    const itemsUIState = {};
    props.report.tagList.forEach(tag => {
      itemsUIState[tag.name] = {
        expanded: false,
      };
    });

    this.state = {
      filterStates: {
        passedSelected: true,
        undefinedSelected: true,
        failedSelected: true,
        skippedSelected: true,
      },
      itemsUIState: itemsUIState,
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
    this.setState(prevState => {
      const newState = Object.assign({}, prevState);
      const storedItem = newState.itemsUIState[tag.name];
      storedItem.expanded = !storedItem.expanded;
      return newState;
    });
  }

  filterTags() {
    const tags = this.props.report.tagList;

    return tags.filter(
      tag =>
        (this.state.filterStates.passedSelected && tag.containsPassed) ||
        (this.state.filterStates.failedSelected && tag.containsFailed) ||
        (this.state.filterStates.undefinedSelected && tag.containsUndefined) ||
        (this.state.filterStates.skippedSelected && tag.containsSkipped)
    );
  }

  render() {
    return (
      <TagListView
        tags={this.filterTags()}
        filterStates={this.state.filterStates}
        itemsUIState={this.state.itemsUIState}
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
