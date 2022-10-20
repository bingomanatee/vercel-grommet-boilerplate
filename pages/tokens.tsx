import {
  Button,
  Text,
  Heading,
  Page,
  PageContent,
  Paragraph,
  Box,
  Card,
  CardBody,
  CardHeader,
  CardFooter, Spinner
} from "grommet";
import { useContext, useEffect } from "react";
import { GlobalProvider } from "../lib/globalState";
import Link from "next/link";


const Tokens = () => {

  const { globalLeaf, globalValue } = useContext(GlobalProvider);
  const { cookieChecked, authorized, sharedToken } = globalValue;

  useEffect(() => {
    if (!authorized && !cookieChecked) {
      console.log('checking cookie');
      globalLeaf.do.initCookie();
    }
  }, [cookieChecked, authorized]);

  useEffect(() => {
    if (!authorized) {
      return;
    }
    let time = 0;
    const update = async () => {
      await globalLeaf.do.refreshSharedToken();
      time = setTimeout(update, 10000);
    }
    update();
    return () => {if (time) clearTimeout(time)};
  }, [authorized])

  return (<Page>
      <PageContent>
        {!sharedToken ? <Spinner size="large"/> : (
          <Card height="large" margin="large">
            <CardHeader>
              <Box justify="center" fill="horizontal"><Heading textAlign="center" level="2">Give me a
                token!</Heading></Box>
            </CardHeader>
            <CardBody pad="xlarge">
              <Text textAlign="center" weight="bolder" size="xxlarge">{sharedToken}</Text>
            </CardBody>
            <CardFooter pad="medium">
              <Box justify="center" fill="horizontal">
                <Text textAlign="center" color="text-xweak">
                  Your email and name will not be associated with this number
                  or shared with anyone else.
                </Text> </Box>
            </CardFooter>
          </Card>
        )}
        <Heading>Tokens</Heading>
        <Paragraph size="large">Share the number above to get a token.</Paragraph>
      </PageContent>
    </Page>
  )
}

export default Tokens;
