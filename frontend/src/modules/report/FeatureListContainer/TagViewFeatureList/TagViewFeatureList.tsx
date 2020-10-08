import React, { FC, ReactNode } from 'react';
import { List, ListItem } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

import { featureListItemStyles } from '../styles/FeatureListContainerStyles';
import { StatusMap, Passed, Failed, Skipped, Undefined } from 'models/Status';
import SimpleFeature from 'models/SimpleFeature';
import { selectFeature } from 'redux/FeatureReducer';

interface Props extends WithStyles {
  productId: string;
  versionString: string;
  selectedFeatureId?: string;
  featureList: SimpleFeature[];
}

const TagViewFeatureList: FC<Props> = ({ productId, versionString, selectedFeatureId, featureList, classes }) => {
  const classesMap: StatusMap<string> = {
    [Passed]: classes.itemPassed,
    [Failed]: classes.itemFailed,
    [Undefined]: classes.itemUndefined,
    [Skipped]: classes.itemSkipped,
  };

  const dispatch = useDispatch();

  const renderFeatureListItem = (feature, statusClasses): ReactNode => {
    let className = `${classes.listItem} ${statusClasses} ${classes.item}`;
    if (feature._id === selectedFeatureId) {
      className += ` ${classes.itemSelected}`;
    }

    return (
      <ListItem
        button
        key={feature._id}
        className={className}
        style={{ display: 'flex' }}
        onClick={(): void => {
          dispatch(selectFeature(productId, versionString, feature));
        }}
      >
        <div style={{ flexBasis: '94%' }}>
          {feature.name}
        </div>
        &nbsp;
        {
          feature.elements ? ( 
          <label className={classes.scenarioCountLabel} title={`${feature.elements.length} ${' feature'}${feature.elements.length > 1 ? 's' : ''} ${'present'}`}>
            { feature.elements.length}
          </label>
          ) : null
        }
      </ListItem>
    );
  };

  return <List>{featureList.map(feature => renderFeatureListItem(feature, classesMap[feature.calculatedStatus]))}</List>;
};

export default withStyles(featureListItemStyles)(TagViewFeatureList);
