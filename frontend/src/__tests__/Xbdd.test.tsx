import React, { ReactNode } from 'react';
import Enzyme, { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);

import Xbdd from '../Xbdd';

Enzyme.configure({ adapter: new Adapter() });

const renderApp = (): ReactNode => {
  const initialState = {
    app: {
      user: null,
    },
  };

  const store = mockStore(initialState);

  return (
    <Provider store={store}>
      <Xbdd />
    </Provider>
  );
};

describe('Xbdd', () => {
  test('it renders without failing', () => {
    const app = mount(renderApp());
    expect(app.find('.xbdd-app')).not.toBeNull();
  });
});
