import { Grommet, Box } from 'grommet'
import grommetTheme from '../lib/grommet-theme'
import '../styles/globals.css'
import AppHead from "../lib/views/AppHead";

//console.log('grommet-theme: ', JSON.stringify(grommetTheme, true, 5))

export default function App({ Component, pageProps }) {
  return (
    <Grommet theme={grommetTheme}>
      <Box height="100%" width="100%" direction="column" justify="start" overflow="hidden">
        <AppHead/>
        <Box overflow="auto">
          <Component {...pageProps} />
        </Box>
      </Box>
    </Grommet>
  )
}
