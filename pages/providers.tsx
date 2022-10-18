import { Button, Text, Heading, Page, PageContent, Paragraph, Box } from "grommet";
import { useContext } from "react";
import { GlobalProvider } from "../lib/globalState";
import Link from "next/link";


export default () => {

  const { globalLeaf, globalValue } = useContext(GlobalProvider);

  return (<Page>
    <PageContent>
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <Heading>Provider</Heading>
      <Paragraph size="large">This section is for those who want to provide a service
        that delivers tokens in exchange for rewards.</Paragraph>
      <Paragraph>
        The classic use case is &quot;buy 10 sandwiches get one free.&quot;
        The nature and form of the rewards and conditions for issuing of tokens is
        up to the provider to determine.
        <b>Turtle Net does not enforce or guarantee</b> promises made by providers to clients.
      </Paragraph>

      {globalValue.providers.providers.length < 2 ? (
        <Box direction="row" gap="small" margin={{vertical: 'medium'}}>
         <Link href="/providers/join">
           <Button primary size="large" plain={false}>Click Here</Button>
         </Link>
          <Paragraph size="large">to become a Service Provider
          </Paragraph>
        </Box>

      ) : ''}


      <Heading level={2}>Some explanations of tokens and rewards</Heading>
      <Heading level={3}>Tokens are associated with a single account.</Heading>
      <Paragraph>
        Tokens are issued to one and only one account. At this point, accounts are
        defined and accessed through a single e-mail address; in the future, the access
        method(s) of accounts may expand (e.g., via SMS or other authorizing service).
        Tokens cannot be transferred between one account and another.
      </Paragraph>
      <Heading level={3}>Tokens do not expire</Heading>
      <Paragraph>
        Providers cannot expire or cancel issuance of tokens other than through delivery of
        rewards.
      </Paragraph>
      <Heading level={3}>Rewards may change over time</Heading>
      <Paragraph>
        Providers have the right to change or cancel rewards at any time without notice.
        We do <i>encourage</i> providers to maintain consistent rewards and inform members if rewards change;
        However we do not <i>enforce</i> good conduct for providers.
      </Paragraph>
      <Heading level={3}>Tokens are not cryptocurrency/bitcoin - or currency of any form</Heading>
      <Paragraph>
        Their pure and sole value is as a means of acquiring rewards.
        Tokens have no monetary value. They are not currency. They are not part of any
        digital currency system other than the reward system provided via Turtle Book Club itself.
      </Paragraph>
    </PageContent>
  </Page>)
}
