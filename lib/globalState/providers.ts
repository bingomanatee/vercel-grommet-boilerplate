import { Leaf } from "@wonderlandlabs/forest";
import axios from "axios";
import dayjs from "dayjs";

export default () => {
  return new Leaf({
      polled: 0,
      providers: []
    },
    {
      actions: {
        poll(leaf) {
          const { id, token} = leaf.parent.value;
          console.log('--- polling providers', id, token);
          axios.get('/api/token-providers', {
            headers: {
              auth: id,
              token
            }
          })
            .then((res) => {
              const {data, headers} = res;
              console.log('got token providers:', data, 'h', headers, 'r=', res);
              const {token_providers} = data;

              if (Array.isArray(token_providers)) {
                leaf.do.setProviders(token_providers);
              }
              if ('auth-expires' in headers) {
                leaf.parent.do.setAuthExpires(dayjs(headers['auth-expires']));
              }
              leaf.parent.do.logIn();
            })
            .catch ((err) => {
              console.log('error getting token providers:', err);
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
