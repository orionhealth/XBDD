import React from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Tag from '../../../models/Tag';
import { tagListItemStyles } from '../styles/TagListStyles';

const TagListItemView = (props) => {
    const className = props.isSelected ? `${props.classes.xbddTagListItemContainer} ${props.classes.xbddTagListItemContainerSelected}` : props.classes.xbddTagListItemContainer;
    const onSelectTag = () => props.onSelectTag(props.tag);

    return (
        <ListItem
            button
            onClick={onSelectTag}
            className={className}
        >
            {props.tag.name}
        </ListItem>
    );
};

TagListItemView.propTypes = {
    tag: PropTypes.instanceOf(Tag).isRequired,
    classes: PropTypes.object.isRequired,
    onSelectTag: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
};

export default withStyles(tagListItemStyles)(TagListItemView);
