import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Tag from '../../models/Tag';

const styles = {
    xbddTagListItemContainer: {
        width: '100%',
        maxWidth: 360,
    },
};

class TagListItem extends Component {
    constructor(props) {
        super(props);
        this.onTagClick = this.onTagClick.bind(this);
    }
    onTagClick() {
        console.log(`${this.props.tag.name} has been clicked`);
    }

    render() {
        return (
            <ListItem
                button
                onClick={this.onTagClick}
                className={this.props.classes.xbddTagListItemContainer}
            >
                {this.props.tag.name}
            </ListItem>
        );
    }
}

TagListItem.propTypes = {
    tag: PropTypes.instanceOf(Tag).isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TagListItem);
