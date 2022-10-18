import { Leaf } from "@wonderlandlabs/forest";
import WithLocalState from "./WithLocalState";
import { createContext } from 'react';

export const GlobalProvider = createContext({ globalLeaf: {}, globalValue: {} })
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import providers from "./globalState/providers";
import { API_ROOT } from "./constants";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const HOURS = 60 * 60;

const globalLeaf = new Leaf({
  id: '',
  token: '',
  expires: null,
  authChecked: false,
  cookieChecked: false,
  authExpires: null,
  authorized: null,
}, {
  actions: {
    badLogin(leaf) {
    //  deleteCookie('id');
    //  deleteCookie('token');
    //  deleteCookie('expires');
      leaf.do.setAuthorized(false);
    },
    logIn(leaf, expires) {
      if (expires) {
        const expiresAt = dayjs(expires);
        if (expiresAt.isValid()) {
          leaf.do.setExpires(expiresAt);
          setCookie('expires', expires);
        }
        if (expiresAt.isBefore(dayjs())) {
          console.log('>>>>>> expired login', expires);
        }
        console.log('>>>>> valid login expiration', expires);
        return;
      }
      leaf.do.setAuthorized(true);
    },
    auth(leaf) {
      const { id, token } = leaf.value;
      if (!(id && token)) {
        console.log('auth: no id,token in value');
        return leaf.do.badLogin();
      }
      console.log('--- connect auth to ', API_ROOT, 'with', id, token);
      axios.post(API_ROOT + 'connect/auth', {}, {
        headers: {
          token, auth: id
        }
      }).then(({ data, headers }) => {
        if ('auth-expires' in headers) {
          leaf.do.logIn(headers['auth-expires']);
        } else if (data.authExpires) {
          leaf.do.logIn(data.authExpires)
        } else {
          leaf.do.logIn();
        }
      }).catch (err => {
        console.log('error authorizing', id, token, err);
      });
    },
    // gets the token from the cookie. note - does NOT validate with server.
    initCookie(leaf) {
      let id = '';
      let token = '';

      try {
        id = getCookie('id', { sameSite: 'strict' });
        token = getCookie('token', { sameSite: 'strict' });
        if (token && id) {
          console.log('id stored in cookies:', id, token);
          leaf.do.setId(id);
          leaf.do.setToken(token);
          console.log('--- after initCookie do auth with ', id, token);
          leaf.do.auth(); // validate token against server
        }
      } catch (err) {
        console.log('error getting cookies', err);
        leaf.do.badLogin();
      }

      leaf.do.setCookieChecked(true);
    },
    // gets the token from the router. note - does NOT validate with server.
    initToken(leaf, router) {
      const { id, token } = router.query;
      console.log('initing token from route: ', id, token);
      leaf.do.setId(id);
      leaf.do.setToken(token);
      leaf.do.setAuthChecked(true);
      setCookie('id', id, { sameSite: 'strict', maxAge: 8 * HOURS });
      setCookie('token', token, { sameSite: 'strict', maxAge: 8 * HOURS });
      router.push('/');
    }
  },
  selectors: {
    loggedIn({ id, token }) {
      return id && token;
    },
    providerCount({ providers }) {
      return providers.providers.length;
    }
  },
  children: {
    providers: providers()
  }
});

export const GlobalState = WithLocalState(() => globalLeaf, ({ leaf, children, ...values }) => {
  return (
    <GlobalProvider.Provider value={
      { globalLeaf: leaf, globalValue: values }
    }>
      {children}</GlobalProvider.Provider>
  )
});
