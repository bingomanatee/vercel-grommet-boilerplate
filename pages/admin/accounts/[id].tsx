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
  CardFooter, Spinner, Header, List, DataTable, CheckBoxGroup, Grid
} from "grommet";
import { useContext, useEffect, useMemo } from "react";
import { GlobalProvider } from "../../../lib/globalState";
import Link from "next/link";
import { useRouter } from "next/router";
import { Edit } from "grommet-icons";
import WithLocalState from "../../../lib/WithLocalState";
import axios from "axios";

function accountProps(account) {
  return Array.from(Object.keys(account))
    .map((field) => {
      let value = account[field];
      return {
        field,
        value
      }
    });
}

const GRID_AREAS = [
  {
    name: 'title',
    start: [0, 0],
    end: [1, 0],
  },
  {
    name: 'action-title',
    start: [0, 1],
    end: [0, 1],
  },
  {
    name: 'target-title',
    start: [1, 1],
    end: [1, 1],
  },
  {
    name: 'action-options',
    start: [0, 2],
    end: [0, 2],
  },
  {
    name: 'target-options',
    start: [1, 2],
    end: [1, 2],
  },
  {
    name: 'buttons',
    start: [0, 3],
    end: [1, 3]
  }
]

function grantList(grants) {
  return grants.map(({ action, target }) => {
    return `${target}:${action}`
  }).sort();
}

const Action = ({ leaf, actions, targets }) => {

  const { globalLeaf, globalValue } = useContext(GlobalProvider);
  const { cookieChecked, authorized, authChecked, accounts: { account } } = globalValue;
  const router = useRouter();

  const { id: accountId } = router.query;

  useEffect(() => {

    if (!(cookieChecked && authChecked)) {
      return globalLeaf.do.init();
    }

    if (authorized === true) {
      console.log('polling accounts');
    }
  }, [cookieChecked, authChecked]);

  useEffect(() => {
    leaf.do.setGlobalLeaf(globalLeaf);
  }, [leaf, globalLeaf])

  useEffect(() => {
    if (authorized && accountId) {
      globalLeaf.child('accounts').do.loadAccount(accountId);
    }
  }, [authorized, accountId])

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

  return (<div>
      <Heading level={1}><Link href={'/admin/accounts'}>Accounts</Link>: {accountId}</Heading>
      {!account ? <Spinner size="large"/> :
        (
          <>
            <List data={accountProps(account)}
                  action={(data) => {
                    console.log('action:', data);
                    if (data.field === 'grants') {
                      return <Box><List data={grantList(data.value)}/></Box>;
                    }
                    return <Box>{data.value}</Box>;
                  }
                  }
            />
            <Grid rows={['auto', 'auto', 'auto', 'auto']}
                  columns={['50%', '50%']}
                  fill="horizontal"
                  gap="4px"
                  margin={
                    { top: 'large', left: 'medium', bottom: 'large' }
                  }
                  areas={GRID_AREAS}
            >

              <Heading gridArea="title" level={2}>Add Grant</Heading>
              <Heading gridArea='action=title' level={3}>Action</Heading>
              <Box gridArea="action-options" pad="small">
                <CheckBoxGroup
                  value={actions}
                  onChange={(e) => {
                    leaf.do.setActions(e.value);
                  }}
                  options={['super', 'admin', 'edit', 'create', 'view']}/>
              </Box>
              <Heading gridArea="target-title" level={3}>Subject</Heading>
              <Box gridArea="target-options" pad="small">
                <CheckBoxGroup
                  value={targets}
                  onChange={(e) => {
                    leaf.do.setTargets(e.value);
                  }}
                  options={['accounts', 'businesses', 'tokens', 'site']}/>
              </Box>
              <Box gridArea="buttons" align="center">
                <Button onClick={leaf.do.addGrants} primary plain={false}>Add Grants</Button>
              </Box>
            </Grid>
          </>
        )
      }
    </div>
  )
}

export default WithLocalState((params, Leaf) => (new Leaf({
  actions: [], targets: [], globalLeaf: {}, state: 'editing',
}, {
  actions: {
    async addGrants(leaf) {
      leaf.do.setState('sending grants');
      const { id: auth, token } = leaf.value.globalLeaf.value;
      const action = await axios.post(
        '/api/accounts/' + leaf.value.globalLeaf.child('accounts').value.id,
        { grants: { actions: leaf.value.actions, targets: leaf.value.targets } },
        {
          headers: {
            auth, token
          }
        }
      );
      leaf.value.globalLeaf.child('accounts').do.setAccount(action);
    }
  }
})), Action);
