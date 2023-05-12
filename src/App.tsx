import { useEffect, useState } from 'react';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { RouterProvider } from 'react-router';
import AppProvider from './AppProvider';
import AppRouter from './components/router/AppRouter';
import { APP_OFFLINE_ALERT } from './constants/AppConstants';
import { OFFLINE_STATUS_NOTIFICATION_KEY } from './constants/NotificationKeyConstants';
import { apiClient, apiURL } from './services/ApiClient';
import {
  setCustomViewportHeightVariable,
  setCustomViewportSizeVariableUpdater,
  setCustomViewportWidthVariable
} from './utility/viewportSizeVariable';

declare module '@mui/material/Button' {
  // eslint-disable-next-line no-unused-vars
  interface ButtonPropsVariantOverrides {
    errorContained: true;
    successContained: true;
    accentContained: true;
    secondaryContained: true;
    errorOutlined: true;
    successOutlined: true;
    accentOutlined: true;
    secondaryOutlined: true;
  }
}

function App() {
  const [shouldDisplayAlert, setShouldDisplayAlert] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      apiClient
        .head(apiURL, { method: 'HEAD', timeout: 3500 })
        .then(() => {
          closeSnackbar(OFFLINE_STATUS_NOTIFICATION_KEY);
          setShouldDisplayAlert(false);
        })
        .catch(() => {
          if (shouldDisplayAlert) {
            enqueueSnackbar(APP_OFFLINE_ALERT, {
              variant: 'error',
              key: OFFLINE_STATUS_NOTIFICATION_KEY,
              persist: true
            });
          }
          setShouldDisplayAlert(true);
        });
    }, 3000);
    return () => clearInterval(interval);
  }, [shouldDisplayAlert]);

  setCustomViewportWidthVariable();
  setCustomViewportHeightVariable();
  setCustomViewportSizeVariableUpdater();

  return (
    <AppProvider>
      <RouterProvider router={AppRouter} />
    </AppProvider>
  );
}

export default App;
