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
  CardFooter, Spinner, Header, List, DataTable, RadioButtonGroup, Grid
} from "grommet";
import { useContext, useEffect, useMemo } from "react";
import { GlobalProvider } from "../../../lib/globalState";
import Link from "next/link";
import { useRouter } from "next/router";
import { Close, Edit } from "grommet-icons";
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

function grantList(leaf, grants) {
  return grants.map((grant) => {
    const { action, target } = grant;
    const term = `${target}:${action}`;
    return {
      name: term,
      value: (
        <Box key={term} direction="row" justify="between">
          <Close onClick={() => leaf.do.removeGrant(grant)}/>
        </Box>
      )
    };
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

  console.log('accounts[id] value:', leaf.value);

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
                    if (data.field === 'grants') {
                      return <Box width="50%"><List border={false}
                                                    primaryKey="name"
                                                    secondaryKey="value"
                                                    data={grantList(leaf, data.value)}/></Box>;
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
                <RadioButtonGroup
                  value={actions}
                  onChange={(e) => {
                    console.log('radio onChange: ', e);
                    leaf.do.setActions(e.target.value);
                  }}
                  options={['super', 'admin', 'edit', 'create', 'view', 'block']}/>
              </Box>
              <Heading gridArea="target-title" level={3}>Subject</Heading>
              <Box gridArea="target-options" pad="small">
                <RadioButtonGroup
                  value={targets}
                  onChange={(e) => {
                    leaf.do.setTargets(e.target.value);
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
    async removeGrant(leaf, grant) {
      const { id: auth, token } = leaf.value.globalLeaf.value;
      if (!(auth && token)) {
        console.log('removeGrant --- no auth in ', leaf.value.globalLeaf);
        return;
      }
      try {
        await axios.delete('/api/grants/' + grant.id, {
          headers: {
            auth, token
          }
        });
        return leaf.value.globalLeaf.child('accounts').do.loadAccount();
      } catch (err) {
        console.log('cannot delete:', err);
      }
    },
    async addGrants(leaf) {
      leaf.do.setState('sending grants');
      const { id: auth, token } = leaf.value.globalLeaf.value;
      try {
        const { data } = await axios.post(
          '/api/accounts/' + leaf.value.globalLeaf.child('accounts').value.id,
          { grants: { actions: leaf.value.actions, targets: leaf.value.targets } },
          {
            headers: {
              auth, token
            }
          }
        );
        leaf.value.globalLeaf.child('accounts').do.setAccount(data.account);
      } catch (err) {
        console.log('error adding grant:', err);
      }
    }
  }
})), Action);
