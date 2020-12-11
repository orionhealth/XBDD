import React, { FC, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Typography, IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faQuestionCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useExecutionHistoryStyles } from './styles/FeatureSummaryStyles';
import Execution from 'models/Execution';
import { StatusMap, Passed, Failed, Skipped, Undefined } from 'models/Status';
import { resetFeatureState } from 'redux/FeatureReducer';
import { RootStore } from 'rootReducer';
import { getEncodedURI } from 'lib/rest/URIHelper';
import { useStatusColorStyles } from 'modules/styles/globalStyles';

interface Props {
  executionHistory: Execution[];
}

const ExecutionHistory: FC<Props> = ({ executionHistory }) => {
  const { t } = useTranslation();
  const classes = useExecutionHistoryStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const report = useSelector((state: RootStore) => state.report.currentReportId);

  const classesMap = useStatusColorStyles();

  const iconMap: StatusMap<ReactNode> = {
    [Passed]: <FontAwesomeIcon icon={faCheckCircle} className={classesMap.passed} />,
    [Failed]: <FontAwesomeIcon icon={faExclamationCircle} className={classesMap.failed} />,
    [Undefined]: <FontAwesomeIcon icon={faQuestionCircle} className={classesMap.undefined} />,
    [Skipped]: <FontAwesomeIcon icon={faMinusCircle} className={classesMap.skipped} />,
  };

  const navigateToBuild = (build: string): void => {
    if (!report || report.build === build) {
      return;
    }
    dispatch(resetFeatureState());
    history.push(`/reports/${getEncodedURI(report.product, report.version, build)}`);
  };

  return (
    <div className={classes.executionHistory}>
      <Typography variant="body2">{t(`report.executionHistory`)}</Typography>
      {executionHistory.map(build => (
        <span key={build.build}>
          <Tooltip title={build.build} placement="top">
            <IconButton className={classes.executionHistoryIcon} onClick={(): void => navigateToBuild(build.build)}>
              {iconMap[build.calculatedStatus]}
            </IconButton>
          </Tooltip>
        </span>
      ))}
    </div>
  );
};

export default ExecutionHistory;
