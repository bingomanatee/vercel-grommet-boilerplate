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
  CardFooter, Spinner, Header, List
} from "grommet";
import { useContext, useEffect } from "react";
import { GlobalProvider } from "../../lib/globalState";
import Link from "next/link";
import { useRouter } from "next/router";


function AdminLInk({ name, title, link }) {
  return <Box>
    <Link href={`/admin/${link}`}>{title}</Link>
  </Box>
}

const Admin = () => {

  const { globalLeaf, globalValue } = useContext(GlobalProvider);
  const { cookieChecked, authorized, authChecked } = globalValue;
  const router = useRouter();

  console.log('global value:', globalValue);
  useEffect(() => {
    if (!(cookieChecked && authChecked)) {
      return globalLeaf.do.init();
    }
    if (authorized === false) {
      router.push('/unauthorized');
    }
  }, [cookieChecked, authChecked]);

  if (!authorized) {
    return <Page><PageContent>
      <Box margin="large" fill={true} justify="center">
        <Spinner size="large"></Spinner>
      </Box>
    </PageContent></Page>
  }

  return (<Page>
      <PageContent>
        <Heading level={1}>Administration</Heading>
        <List primaryKey="name" data={[
          { name: 'accounts', title: 'Accounts', link: 'accounts' }
        ]}
              children={(item) => {
                return <AdminLInk {...item} />
              }}>
        </List>
      </PageContent>
    </Page>
  )
}

export default Admin
