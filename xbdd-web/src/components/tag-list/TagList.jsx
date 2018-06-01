import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Report from '../../models/Report';
import TagListItem from './TagListItem';
import TagListFilterButtons from './TagListFilterButtons';
import { tagListStyles } from './TagListStyles';

class TagList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            passedSelected: true,
            undefinedSelected: true,
            failedSelected: true,
            skippedSelected: true,
            selectedTag: null,
        };
        this.onFilterButtonClick = this.onFilterButtonClick.bind(this);
        this.onSelectTag = this.onSelectTag.bind(this);
    }

    onFilterButtonClick(stateAttribute) {
        this.setState(prevState => ({
            [stateAttribute]: !prevState[stateAttribute],
        }));
    }

    onSelectTag(tag) {
        this.setState({
            selectedTag: tag,
        });
    }

    filterTags() {
        const tags = this.props.report.tagList;

        return tags.filter(tag => (this.state.passedSelected && tag.containsPassed)
            || (this.state.undefinedSelected && tag.containsUndefined)
            || (this.state.failedSelected && tag.containsFailed)
            || (this.state.skippedSelected && tag.containsSkipped));
    }

    mapTagToTagListItem(tag) {
        const isSelected = tag === this.state.selectedTag;

        return (
            <TagListItem
                tag={tag}
                key={tag.name}
                onSelectTag={this.onSelectTag}
                isSelected={isSelected}
            />);
    }

    renderList() {
        return (
            <List component="ul" >
                {this.filterTags().map(tag => this.mapTagToTagListItem(tag))}
            </List>
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={`${classes.xbddTagListContainer} xbdd-tab-list-container`}>
                <TagListFilterButtons
                    state={this.state}
                    onFilterButtonClick={this.onFilterButtonClick}
                />
                <div className={classes.xbddTagList}>
                    {this.renderList()}
                </div>
            </div>
        );
    }
}

TagList.propTypes = {
    report: PropTypes.instanceOf(Report).isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(tagListStyles)(TagList);
