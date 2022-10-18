import { Box, Button, Header, Heading, Text } from "grommet";
import style from '../../styles/AppHead.module.css';
import { GlobalProvider } from "../globalState";
import { useContext, useEffect } from "react";
import Link from "next/link";

const AppHead = () => {
  const { globalValue, globalLeaf } = useContext(GlobalProvider);

  useEffect(() => {
    if (globalValue.$loggedIn) {
      globalLeaf.child('providers').do.poll();
    }

  }, [globalLeaf, globalValue.$loggedIn])

  return (
    <Header background="brand" pad={{ vertical: '0å', horizontal: 'medium' }}>
      <Link href="/"><img src="/img/logo.svg" className={style.logo}/></Link>
      <Heading level={1}>Turtle Web Coupons</Heading>
      {
        globalValue.$loggedIn ? (
            <Box direction="row">
              {!globalValue.authExpires ? '' : <Box>
                <Box>
                  <Text color="status-warning">{globalValue.authExpires.toString()}</Text>
                </Box>
                <Text size="small" color="status-warn">Auth expires</Text>
              </Box>}
              <Box direction="column" fill="vertical" justify="stretch">
                <img src="/img/client-icon.svg" className={style.icon}/>
                <Link href="tokens"><Text textAlign="center">Tokens</Text></Link>
              </Box>
              <Box direction="column" fill="vertical" justify="stretch">
                <Link href="providers"><Button plain>
                  <img src="/img/publisher-icon.svg" className={style.icon}/>
                </Button></Link>
                <Button plain badge={{
                  value: globalValue.providers?.providers?.length,
                  background: 'red'
                }}>
                  <Link href="providers"><Text textAlign="center">Providers</Text></Link>
                </Button>
              </Box>
            </Box>
          ) :
          <Box>&nbsp;</Box>
      }
    </Header>
  );
}

export default AppHead;
