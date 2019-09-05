import React, { Component } from "react";
import { PropTypes } from "prop-types";
import Tag from "../../../models/Tag";
import TagListView from "./TagListView";

class TagListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStatus: {
        passed: true,
        failed: true,
        undefined: true,
        skipped: true,
      },
      expandedTagsList: [],
    };
    this.handleFilterButtonClick = this.handleFilterButtonClick.bind(this);
    this.handleTagSelect = this.handleTagSelect.bind(this);
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  handleFilterButtonClick(status) {
    this.setState(prevState =>
      Object.assign({}, prevState, {
        selectedStatus: Object.assign({}, prevState.selectedStatus, {
          [status]: !prevState.selectedStatus[status],
        }),
      }));
  }

  handleTagSelect(tag) {
    if (this.state.expandedTagsList.includes(tag)) {
      const newExpandTagsList = [...this.state.expandedTagsList];
      const index = newExpandTagsList.indexOf(tag);
      newExpandTagsList.splice(index, 1);
      this.setState({ expandedTagsList: newExpandTagsList });
    } else {
      this.setState({ expandedTagsList: [...this.state.expandedTagsList, tag] });
    }
  }

  filterTags() {
    const tagList = this.props.tagList;

    return tagList.filter(
      tag =>
        (this.state.selectedStatus.passed && tag.containsPassed) ||
        (this.state.selectedStatus.failed && tag.containsFailed) ||
        (this.state.selectedStatus.undefined && tag.containsUndefined) ||
        (this.state.selectedStatus.skipped && tag.containsSkipped)
    );
  }

  render() {
    return (
      <TagListView
        tagList={this.filterTags()}
        selectedStatus={this.state.selectedStatus}
        expandedTagsList={this.state.expandedTagsList}
        handleFilterButtonClick={this.handleFilterButtonClick}
        handleTagSelect={this.handleTagSelect}
      />
    );
  }
}

TagListContainer.propTypes = {
  tagList: PropTypes.arrayOf(PropTypes.instanceOf(Tag)),
};

export default TagListContainer;
