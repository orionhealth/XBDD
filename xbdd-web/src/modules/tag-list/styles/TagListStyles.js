const tagListStyles = theme => ({
    xbddTagListContainer: {
        height: 'calc(100vh - 300px)',
        width: '100%',
        maxWidth: 308,
        padding: '20px',
        backgroundColor: theme.palette.background.paper,
    },
    xbddTagList: {
        position: 'relative',
        width: 'calc(100% - 2px)',
        height: 'calc(100% - 50px)',
        overflowY: 'scroll',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: '3px',
    },
    xbddTagListFilterButtons: {
        height: '50px',
        width: '100%',
    },
    xbddFilterButton: {
        width: 90,
    },
});

const tagListFilterButtonStyles = theme => ({
    xbddTagListFilterButtons: {
        height: '48px',
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginBottom: '15px',
    },
    xbddFilterButton: {
        width: 77,
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: 0,
        borderRight: 0,
    },
    xbddFilterButtonFirst: {
        borderRadius: '3px 0 0 3px',
    },
    xbddFilterButtonLast: {
        borderRight: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: '0 3px 3px 0',
    },
});

const tagListItemStyles = {
    xbddTagListItemContainer: {
        width: '100%',
    },
    xbddTagListItemContainerSelected: {
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
};

export { tagListStyles, tagListFilterButtonStyles, tagListItemStyles };
