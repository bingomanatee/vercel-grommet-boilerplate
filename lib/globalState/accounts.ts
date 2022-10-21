import { Leaf } from "@wonderlandlabs/forest";
import axios from "axios";
import dayjs from "dayjs";

export default () => {
  return new Leaf({
      polled: 0,
      accounts: [],
      id: '',
      accountError: null,
      account: null,
    },
    {
      actions: {
        loadAccount(leaf, accountId) {
          if (!accountId) {
            if (leaf.value.id) {
              accountId = leaf.value.id;
            } else {
              throw new Error('attempt to load account with no id stored')
            }
          } else {
            leaf.do.setId(accountId);
          }

          const { id: auth, token} = leaf.parent.value;

          console.log('--- getting account', accountId);
          return axios.get(`/api/accounts/${accountId}`, {
            headers: {
              auth,
              token
            }
          })
            .then((res) => {
              const {data, headers} = res;

              const {account} = data;
              leaf.do.setAccount(account);
              return account;
            })
            .catch ((err) => {
              console.log('error getting account:', accountId, err);
              const headers = err.response?.headers;
              if (headers) {
                console.log('headers in response:', headers);
              }
              leaf.do.setAccountError(err);
            })

        },
        poll(leaf) {
          const { id, token} = leaf.parent.value;
          console.log('--- polling accounts', id, token);
          axios.get('/api/accounts', {
            headers: {
              auth: id,
              token
            }
          })
            .then((res) => {
              const {data, headers} = res;
              console.log('got accounts:', data, 'h', headers, 'r=', res);
              const {accounts} = data;

              if (Array.isArray(accounts)) {
                leaf.do.setAccounts(accounts);
              }
              if ('auth-expires' in headers) {
                leaf.parent.do.setAuthExpires(dayjs(headers['auth-expires']));
              }
            })
            .catch ((err) => {
              console.log('error getting accounts:', err);
              const headers = err.response?.headers;
              if (headers) {
                console.log('headers in response:', headers);
              }
              leaf.parent.do.badLogin();
            })
        }
      }
    })
}
