import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import reportViewerStyles from './styles/reportViewerStyles'

class ReportViewerContainer extends Component {
    constructor(props) {
        super(props)
        
    }

    render() {
        return (
            <div/>
        )
    }
}


export default withStyles(reportViewerStyles)(ReportViewerContainer);