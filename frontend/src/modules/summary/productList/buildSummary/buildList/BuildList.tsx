import React, { FC, useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp, faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useBuildListStyles } from './styles/BuildListStyles';
import BuildListItem from './BuildListItem';
import Build from 'models/Build';

interface Props {
  product: string;
  version: string;
  buildList: Build[];
}

const BuildList: FC<Props> = ({ product, version, buildList }) => {
  const { t } = useTranslation();
  const classes = useBuildListStyles();
  const [expanded, setExpanded] = useState(false);
  const pinnedBuildList = buildList.filter(build => build.isPinned);
  let unpinnedBuildList = buildList.filter(build => !build.isPinned);

  const isExpandable = unpinnedBuildList.length > 5;
  unpinnedBuildList = isExpandable && !expanded ? unpinnedBuildList.slice(0, 5) : unpinnedBuildList;

  const renderList = (buildList: Build[]) => {
    return buildList.map(build => <BuildListItem key={build.name} product={product} version={version} build={build} />);
  };

  return (
    <div className={classes.buildListContainer}>
      {pinnedBuildList.length !== 0 && <List>{renderList(pinnedBuildList)}</List>}
      {unpinnedBuildList.length !== 0 && <List>
        {renderList(unpinnedBuildList)}
        {isExpandable && (
          <ListItem button divider onClick={(): void => setExpanded(!expanded)}>
            <ListItemIcon className={classes.arrowIcon}>
              <FontAwesomeIcon icon={expanded ? faAngleDoubleUp : faAngleDoubleDown} />
            </ListItemIcon>
            <ListItemText>{expanded ? t('summary.showLess') : t('summary.showMore')}</ListItemText>
          </ListItem>
        )}
      </List>}
    </div>
  );
};

export default BuildList;
