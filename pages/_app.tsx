import { Grommet, Box } from 'grommet'
import grommetTheme from '../lib/grommet-theme'
import '../styles/globals.css'
import AppHead from "../lib/views/AppHead";
import { GlobalState } from "../lib/globalState";

export default function App({ Component, pageProps }) {
  return (
    <Grommet theme={grommetTheme}>
      <GlobalState>
        <Box height="100%" width="100%" direction="column" justify="start" overflow="hidden">
          <AppHead/>
          <Box overflow="auto">
            <Component {...pageProps} />
          </Box>
        </Box>
      </GlobalState>
    </Grommet>
  )
}
