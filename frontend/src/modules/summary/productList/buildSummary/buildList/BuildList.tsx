import React, { FC, useState, ReactNode } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp, faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useBuildListStyles } from './styles/BuildListStyles';
import BuildListItem from './BuildListItem';

interface Props {
  product: string;
  version: string;
  pinnedBuildList: string[];
  unpinnedBuildList: string[];
}

const BuildList: FC<Props> = ({ product, version, pinnedBuildList, unpinnedBuildList }) => {
  const { t } = useTranslation();
  const classes = useBuildListStyles();
  const [expanded, setExpanded] = useState(false);

  const renderPinnedBuildList = (): ReactNode => (
    <List>
      <BuildListItem product={product} version={version} isPinned={true} buildList={pinnedBuildList} />
    </List>
  );

  const renderUnpinnedBuildList = (): ReactNode => {
    const isExpandable = unpinnedBuildList.length > 5;
    const buildList = isExpandable && !expanded ? unpinnedBuildList.slice(0, 5) : unpinnedBuildList;

    return (
      <List>
        <BuildListItem product={product} version={version} isPinned={false} buildList={buildList} />
        {isExpandable && (
          <ListItem button divider className={classes.buildListItem} onClick={(): void => setExpanded(!expanded)}>
            <ListItemIcon className={classes.arrowIcon}>
              <FontAwesomeIcon icon={expanded ? faAngleDoubleUp : faAngleDoubleDown} />
            </ListItemIcon>
            <ListItemText>{expanded ? t('summary.showLess') : t('summary.showMore')}</ListItemText>
          </ListItem>
        )}
      </List>
    );
  };

  return (
    <div className={classes.buildListContainer}>
      {pinnedBuildList.length !== 0 && renderPinnedBuildList()}
      {unpinnedBuildList.length !== 0 && renderUnpinnedBuildList()}
    </div>
  );
};

export default BuildList;
