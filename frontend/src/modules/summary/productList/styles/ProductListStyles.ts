import { createStyles, makeStyles } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

export const useProductListStyles = makeStyles(theme =>
  createStyles({
    productListTitle: {
      paddingTop: '10px',
      paddingBottom: '10px',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    titleText: {
      color: 'white',
      marginLeft: '20px',
    },
    searchBar: {
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    productListItem: {
      paddingTop: '2px',
      paddingBottom: '2px',
    },
    checkedFavourite: {
      color: red[300],
    },
  })
);
