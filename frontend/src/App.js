import 'react-perfect-scrollbar/dist/css/styles.css';
import React,{ useEffect } from 'react';
import { Provider } from "react-redux";
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';

import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import { loadUser } from "src/actions/authActions.js";
import store from './store.js';

const App = () => {
  
  const routing = useRoutes(routes);

  useEffect(() => {
    store.dispatch(loadUser())
    return () => {
      console.log("Cleanup done!!")
    }
  }, [])

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {routing}
      </ThemeProvider>
    </Provider>
  );
};

export default App;
