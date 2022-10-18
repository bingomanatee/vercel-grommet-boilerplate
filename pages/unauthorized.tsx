import { Heading, Page, PageContent, Paragraph, Spinner, } from "grommet";
import Link from "next/link";

const Unauthorized = () => {
  return (
    <Page>
      <PageContent>
        <Heading>Unauthorized</Heading>
        <Paragraph>
          Your login token is not recognized or is absent.
          Please use a new token link <Link href="/">or request a login token</Link>
        </Paragraph>
      </PageContent>
    </Page>
  )
}

export default Unauthorized;
