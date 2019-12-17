import React, { useState, useEffect } from 'react';
import RequestService from '../../util/RequestService';
import AuthContext from '../../AuthContext';
import './QueueContainer.css';
import Queue from './components/Queue';
import { processActiveColors } from '../../util/ColorUtils';

const QueueContainer = () => {
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [statusView, setStatusView] = useState('PENDING_REVIEW');
  const [colors, setColors] = useState();

  useEffect(() => {
    setLoading(true);
    const colorList = processActiveColors();
    setColors(colorList);
    setLoading(false);
  }, []);

  const returnCardStatus = cardStatus => {
    const failedStatuses = ['FAILED', 'REJECTED', 'COMPLETED', 'ARCHIVED'];
    const waitingStatuses = ['PENDING_CUSTOMER_RESPONSE', 'PENDING_REVIEW'];
    if (failedStatuses.indexOf(cardStatus) !== -1) {
      return 'DONE';
    } else if (waitingStatuses.indexOf(cardStatus) !== -1) {
      return 'PENDING_REVIEW';
    } else {
      return 'PRINTING';
    }
  };

  const onSaveCardSuccess = response => {
    const cardStatus = response.data.data[0].status;
    if (cardStatus !== statusView) {
      setStatusView(returnCardStatus(cardStatus));
    }
  };

  const onFailure = error => {
    console.log('ERROR SAVING CARD:', error);
  };

  const saveCard = updatedCard => {
    RequestService.saveCard(updatedCard, onSaveCardSuccess, onFailure);
  };

  useEffect(() => {
    setLoading(true);
    //TO DO: GET PRINT JOBS BASED ON STATUS, NOT ALL AT ONCE
    RequestService.getPrintJobs(
      response => {
        const activeCards = response.data.data.filter(card => {
          if (
            statusView === 'DONE' &&
            returnCardStatus(card.status) === 'DONE'
          ) {
            return card;
          } else if (
            statusView === 'PENDING_REVIEW' &&
            returnCardStatus(card.status) === 'PENDING_REVIEW'
          ) {
            return card;
          } else if (statusView === 'PRINTING' && card.status === 'PRINTING') {
            return card;
          }
        });
        setFilteredData(activeCards);
        setLoading(false);
      },
      error => console.error(error),
    );
  }, [statusView]);

  const setStatus = view => {
    setStatusView(view);
  };

  return (
    <AuthContext.Consumer>
      {context => {
        return (
          <Queue
            loading={loading}
            statusView={statusView}
            setStatus={setStatus}
            filteredData={filteredData}
            colors={colors}
            saveCard={saveCard}
            employeeId={context.employeeId}
          />
        );
      }}
    </AuthContext.Consumer>
  );
};

export default QueueContainer;
