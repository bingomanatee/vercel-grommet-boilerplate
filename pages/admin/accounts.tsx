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
  CardFooter, Spinner, Header, List, DataTable
} from "grommet";
import { useContext, useEffect, useMemo } from "react";
import { GlobalProvider } from "../../lib/globalState";
import Link from "next/link";
import { useRouter } from "next/router";
import { Edit } from "grommet-icons";


const cols = (router) => ([
  {
    property: 'id', primary: true, header: 'ID', size: 'small', render: ({ id }) => {
      return <Text truncate>{id}</Text>
    }
  },
  { property: 'email', sortable: true, header: 'eMail' },
  { property: 'name', sortable: true, header: 'Name' },
  {
    property: 'edit', header: '&nbsp;',
    render: ({ id }) => {
      return <Box><Link href={`/admin/accounts/${id}`}><Button plain icon={<Edit color="link"/>}>Edit</Button></Link></Box>
    }
  }
])

const Admin = () => {

  const { globalLeaf, globalValue } = useContext(GlobalProvider);
  const { cookieChecked, authorized, authChecked, accounts: { accounts } } = globalValue;
  const router = useRouter();

  const ACCOUNTS_COLS = useMemo(() => cols(router), [router]);

  useEffect(() => {
    console.log('--- checks!!!', authChecked, 'cc', cookieChecked);
    if (!(cookieChecked && authChecked)) {
      return globalLeaf.do.init();
    }
    console.log('----- passed init', authChecked, 'cc', cookieChecked);
    if (authorized === true) {
      console.log('polling accounts');
      globalLeaf.child('accounts').do.poll();
    }
  }, [cookieChecked, authChecked]);

  console.log('acc status: authorized =', authorized, 'accounts: ', accounts);
  if (authorized === false) {
    router.push('/unauthorized');
  }

  if (!authorized) { // it is null
    return <Page><PageContent>
      <Box margin="large" fill={true} justify="center">
        <Spinner size="large"></Spinner>
      </Box>
    </PageContent></Page>
  }

  return (<Page>
      <PageContent>
        <Heading level={1}>Accounts</Heading>
        <DataTable sortable data={accounts} columns={ACCOUNTS_COLS} step={100} paginate={true}/>
      </PageContent>
    </Page>
  )
}

export default Admin
