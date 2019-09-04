import React, { Component } from "react";
import { PropTypes } from "prop-types";
import Tag from "../../../models/Tag";
import TagListView from "./TagListView";

class TagListContainer extends Component {
  constructor(props) {
    super(props);

    const selectedTags = {};
    props.tagList.forEach(tag => {
      selectedTags[tag.name] = false;
    });

    this.state = {
      selectedStatus: {
        passed: true,
        failed: true,
        undefined: true,
        skipped: true,
      },
      selectedTags: selectedTags,
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
    this.setState(prevState =>
      Object.assign({}, prevState, {
        selectedTags: Object.assign({}, prevState.selectedTags, {
          [tag]: !prevState.selectedTags[tag],
        }),
      }));
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
        selectedTags={this.state.selectedTags}
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
