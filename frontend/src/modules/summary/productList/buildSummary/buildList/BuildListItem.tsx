import React, { FC, MouseEvent } from 'react';
import { ListItem, ListItemIcon, ListItemText, Checkbox } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { grey } from '@material-ui/core/colors';
import { useTranslation } from 'react-i18next';

interface Props {
  isPinned: boolean;
  buildList: string[];
  onClick(event: MouseEvent, build: string): void;
}

const BuildListItem: FC<Props> = props => {
  const { t } = useTranslation();
  const { isPinned, buildList, onClick } = props;

  return (
    <>
      {buildList.map(build => (
        <ListItem button key={build} onClick={(event: MouseEvent): void => onClick(event, build)}>
          <ListItemText>{t('summary.buildDisplay', { build })}</ListItemText>
          <ListItemIcon>
            <Checkbox
              icon={<FontAwesomeIcon icon={faThumbtack} style={{ color: grey[300] }} />}
              checkedIcon={<FontAwesomeIcon icon={faThumbtack} style={{ color: grey[700] }} />}
              checked={isPinned}
            />
          </ListItemIcon>
        </ListItem>
      ))}
    </>
  );
};

export default BuildListItem;
