import { Grommet, Box, grommet as grommetTheme } from 'grommet'
import styles from '../styles/App.module.css'
import '../styles/globals.css'
import AppHead from "../lib/views/AppHead";

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
