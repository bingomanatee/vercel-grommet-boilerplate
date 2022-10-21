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
            })
            .catch ((err) => {
              console.warn('error getting token providers:', err, 'with', leaf.parent.value);
              const headers = err.response?.headers;
              if (headers) {
                console.warn('headers in response:', headers);
              }
            })
        }
      }
    })
}
