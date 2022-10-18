import { Leaf } from "@wonderlandlabs/forest";
import WithLocalState from "./WithLocalState";
import { createContext } from 'react';

export const GlobalProvider = createContext({ globalLeaf: {}, globalValue: {} })
import { setCookie, getCookie } from 'cookies-next';
import providers from "./globalState/providers";

const HOURS = 60 * 60;

const globalLeaf = new Leaf({
  id: '',
  token: '',
  authChecked: false,
  cookieChecked: false,
  authExpires: null,
  authorized : null,
}, {
  actions: {
    badLogin(leaf) {
      leaf.do.setAuthorized(false);
    },
    logIn(leaf) {
      leaf.do.setAuthorized(true);
    },
    // gets the token from the cookie. note - does NOT validate with server.
    initCookie(leaf) {
      let id = '';
      let token = '';

      try {
        id = getCookie('id', {sameSite: 'strict'});
        token = getCookie('token', {sameSite: 'strict'});
        if (token && id) {
          console.log('id stored in cookies:', id, token);
          leaf.do.setId(id);
          leaf.do.setToken(token);
        }
      } catch(err) {
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
      setCookie('id', id, {sameSite: 'strict', maxAge: 8 * HOURS});
      setCookie('token', token, {sameSite: 'strict', maxAge: 8 * HOURS});
      router.push('/');
    }
  },
  selectors: {
    loggedIn({ id, token }) {
      return id && token;
    },
    providerCount({providers}) {
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
