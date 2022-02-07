import { Box, ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Navbar from "../components/navbar";
import "../styles/wrapper.css";
import "../styles/main.css";
import "../styles/rich-text-editor.css";
import "react-datepicker/dist/react-datepicker.css";
import theme from "../theme";
import Head from "next/head";
import { UserProvider } from "../components/providers/userprovider";
import { UrqlClientProvider } from "../components/providers/urqlclientprovider";
import { CourseProvider } from "../components/providers/courseprovider";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import fi from "date-fns/locale/fi";
import CookieDisclamer from "../components/utils/cookiedisclamer";
import { isIE } from "../utils/utils";
function App({ Component, pageProps }: any) {
  useEffect(() => {
    registerLocale("fi", fi);
    setDefaultLocale("fi");
    if (isIE()) {
      alert("Sivustomme ei toimi oikein vanhoilla selaimilla (kuten Internet Explorer). Käytä modernia selainta");
    }
  }, []);

  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

        <script src="/rich-dep/jquery-3.6.0.min.js" />
        <script src="/rich-dep/rich-text-editor-bundle.js" async />
        <script src="/scripts/check-ie.js" noModule async />
        <title>Vertais.fi</title>
      </Head>
      <UrqlClientProvider>
        <UserProvider>
          <CourseProvider>
            <ChakraProvider resetCSS theme={theme}>
              <ColorModeProvider
                options={{
                  useSystemColorMode: true,
                }}
              >
                <Box id="page-wrapper" w="100vw" maxW="100vw">
                  <Navbar />
                  <Component {...pageProps} />
                  <CookieDisclamer />
                </Box>
              </ColorModeProvider>
            </ChakraProvider>
          </CourseProvider>
        </UserProvider>
      </UrqlClientProvider>
    </>
  );
}

export default App;
