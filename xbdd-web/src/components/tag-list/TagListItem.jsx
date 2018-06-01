import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Tag from '../../models/Tag';
import { tagListItemStyles } from './TagListStyles';

class TagListItem extends Component {
    constructor(props) {
        super(props);
        this.onSelectTag = this.props.onSelectTag.bind(this, this.props.tag);
    }

    render() {
        const className = this.props.isSelected ? `${this.props.classes.xbddTagListItemContainer} ${this.props.classes.xbddTagListItemContainerSelected}` : this.props.classes.xbddTagListItemContainer;
        return (
            <ListItem
                button
                onClick={this.onSelectTag}
                className={className}
            >
                {this.props.tag.name}
            </ListItem>
        );
    }
}

TagListItem.propTypes = {
    tag: PropTypes.instanceOf(Tag).isRequired,
    classes: PropTypes.object.isRequired,
    onSelectTag: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
};

export default withStyles(tagListItemStyles)(TagListItem);
