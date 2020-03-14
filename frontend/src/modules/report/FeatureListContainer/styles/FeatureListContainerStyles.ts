import { createStyles } from '@material-ui/core';

const featureListContainerStyles = createStyles({
  featureListTitle: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '4px 4px 0 0',
    backgroundColor: '#457B9D',
    color: 'white',
    textAlign: 'left',
  },
  xbddTagListContainer: {
    padding: '12px 24px 24px 24px',
  },
  checkedIcon: {
    color: '#7dc3ff',
    fontSize: '20px',
  },
  unCheckedIcon: {
    fontSize: '20px',
  },
});

const filterButtonStyles = createStyles({
  xbddFilterButtons: {
    padding: '24px 24px 12px 24px',
  },
  xbddFilterButton: {
    height: 'calc(100% - 4px)',
    marginTop: '2px',
    marginBottom: '2px',
    borderRadius: 0,
    width: '25%',
    borderRight: '1px solid rgba(0, 0, 0, 0.23)',
  },
  xbddFilterButtonPassed: {
    color: '#576E5D',
  },
  xbddFilterButtonFailed: {
    color: '#AC534F',
  },
  xbddFilterButtonUndefined: {
    color: '#C39575',
  },
  xbddFilterButtonSkipped: {
    color: '#457B9D',
    borderRight: 'hidden',
  },
  xbddFilterButtonUnselected: {
    color: '#E0E0E0',
  },
});

const featureListItemStyles = createStyles({
  tags: {
    height: '18px',
    margin: '0 2px',
    background: '#428bca',
    color: 'white',
  },
  item: {
    lineHeight: '22px',
    display: 'inline-block',
  },
  itemPassed: {
    color: '#576E5D',
  },
  itemFailed: {
    color: '#AC534F',
  },
  itemUndefined: {
    color: '#C39575',
  },
  itemSkipped: {
    color: '#457B9D',
  },
  itemSelected: {
    fontWeight: 'bold',
    backgroundColor: '#E0E0E0',
  },
  xbddTagViewFeatureListItem: {
    paddingLeft: '40px',
  },
});

export { featureListContainerStyles, filterButtonStyles, featureListItemStyles };
