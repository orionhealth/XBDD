import React from "react";
import { PropTypes } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import Tag from "../../../models/Tag";
import { tagListItemStyles } from "../styles/TagListStyles";

const TagListItemView = (props) => {
  const { tag, classes, onSelectTag, isSelected } = props;
  let className = classes.xbddTagListItemContainer;

  if (isSelected) {
    className += ` ${classes.xbddTagListItemContainerSelected}`;
  }
  const onClick = () => onSelectTag(props.tag);

  return (
    <ListItem button onClick={onClick} className={className}>
      {tag.name}
    </ListItem>
  );
};

TagListItemView.propTypes = {
  tag: PropTypes.instanceOf(Tag).isRequired,
  classes: PropTypes.shape({}).isRequired,
  onSelectTag: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default withStyles(tagListItemStyles)(TagListItemView);
