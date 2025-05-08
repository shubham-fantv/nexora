import SnackBar from "@/src/component/Snackbar";
import { SnackbarProvider } from "@/src/context/SnackbarContext";
import { CacheProvider } from "@emotion/react";
import "@fontsource/inter";
import "animate.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createEmotionCache from "../createEmotionCache";
import Layout from "../src/Layout";
import store from "../src/redux/store";
import AppSeo from "../src/seo/app";
import PageThemeProvider from "../src/styles/PageThemeProvider";
import "/styles/globals.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, refetchOnMount: false },
  },
});

const persistor = persistStore(store, {}, function () {
  persistor.persist();
});

function MyApp({ Component, pageProps, emotionCache = createEmotionCache() }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="508551165708-227o7s8mmoc7sdt41999gqjratr78tjq.apps.googleusercontent.com">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <CacheProvider value={emotionCache}>
              <PageThemeProvider {...pageProps}>
                <AppSeo />
                <SnackbarProvider>
                  <SnackBar />
                  <Layout {...pageProps}>
                    <Component {...pageProps} />
                  </Layout>
                </SnackbarProvider>
              </PageThemeProvider>
            </CacheProvider>
          </PersistGate>
        </Provider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
export default MyApp;
