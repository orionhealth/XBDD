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
  listItem: {
    paddingLeft: '40px',
  },
  scenarioCountLabel: {
    borderRadius: '50%', 
    backgroundColor: '#457B9D', 
    color: 'white', 
    textAlign: 'center', 
    border: 'none',
    width: '20px', 
    height: '20px', 
    fontSize: '12px',
  }
});

export { featureListContainerStyles, featureListItemStyles };
