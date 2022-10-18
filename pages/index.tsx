import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Box, Button, Heading, Page, PageContent, Text, Paragraph, TextInput } from "grommet";
import WithLocalState from "../lib/WithLocalState";
import { Leaf } from "@wonderlandlabs/forest";
import { isEmail } from 'validator';
import axios from "axios";
import { useContext, useEffect } from "react";
import { GlobalProvider } from "../lib/globalState";
import LoggedIn from "../lib/views/LoggedIn";
import { useRouter } from "next/router";

const Home: NextPage = ({ email, leaf, clicked, sent, $canSubmit }) => {
  const gv = useContext(GlobalProvider);
  const router = useRouter();

  if (gv.globalValue.authorized === false) {
    router.push('/unauthorized');
    return '';
  }
  const { id, token, cookieChecked, authorized } = gv.globalValue;
  console.log('gv.globalValue:', gv.globalValue);
  useEffect(() => {
    if (!authorized && !cookieChecked) {
      console.log('checking cookie');
      gv.globalLeaf.do.initCookie();
    }
  }, [cookieChecked, authorized]);
  if (id && token) {
    return <LoggedIn/>
  }
  return (
    <Page>
      <PageContent>
        <Heading level={1}>Welcome to Turtle Web Coupons!</Heading>
        <Paragraph>
          Enter your eMail below to receive login tokens.
          If you already have login tokens,
          use them to log in to our site.
        </Paragraph>
        <Box direction="row" justify="between" gap="medium" overflow="visible" pad="6px">
          <TextInput value={email} placeholder="enter email address"
                     onChange={(e) => leaf.do.setEmail(e.target.value)}
                     disabled={clicked}
                     size="lg" type="email"></TextInput>
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <Button plain={false} onClick={leaf.do.submit}
                  disabled={!$canSubmit}
                  primary><Text size="lg">
            Get Tokens
          </Text>
          </Button>
        </Box>
        {(!sent) ? '' : <Paragraph>
          Your login tokens have been sent to the e-mail address above. Check your in-box and
          click on the first token to get into TurtleBook Club.
        </Paragraph>}
      </PageContent>
    </Page>
  )
}

export default WithLocalState(() => {
  return new Leaf({ email: '', clicked: false, sent: false }, {
    actions: {
      submit(leaf) {
        leaf.do.setClicked(true);
        axios.post('/api/bridge', { email: leaf.value.email })
          .then(({ data }) => {
            leaf.do.setSent(true);
          })
      }
    },
    selectors: {
      canSubmit({ email, clicked }) {
        return !clicked && isEmail(email);
      }
    },
  });
}, Home);
