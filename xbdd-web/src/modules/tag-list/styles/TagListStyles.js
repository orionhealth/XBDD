const tagListStyles = theme => ({
    xbddTagListContainer: {
        backgroundColor: theme.palette.background.paper,
        height: 'calc(100vh - 300px)',
        maxWidth: 308,
        padding: '20px',
        width: '100%',
    },
    xbddTagList: {
        backgroundColor: theme.palette.background.paper,
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: '3px',
        height: 'calc(100% - 50px)',
        overflowY: 'scroll',
        position: 'relative',
        width: 'calc(100% - 2px)',
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
        backgroundColor: theme.palette.background.paper,
        height: '48px',
        marginBottom: '15px',
        width: '100%',
    },
    xbddFilterButton: {
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: 0,
        borderRight: 0,
        width: 77,
    },
    xbddFilterButtonFirst: {
        borderRadius: '3px 0 0 3px',
    },
    xbddFilterButtonLast: {
        borderRadius: '0 3px 3px 0',
        borderRight: '1px solid rgba(0, 0, 0, 0.23)',
    },
});

const tagListItemStyles = {
    xbddTagListItemContainer: {
        width: '100%',
    },
    xbddTagListItemContainerSelected: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        width: '100%',
    },
};

export { tagListStyles, tagListFilterButtonStyles, tagListItemStyles };
