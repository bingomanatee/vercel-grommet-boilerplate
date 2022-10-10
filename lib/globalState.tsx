import { Leaf } from "@wonderlandlabs/forest";
import WithLocalState from "./WithLocalState";
import { createContext } from 'react';

export const GlobalProvider = createContext({ globalLeaf: {  }, globalValue: {  } })

const globalLeaf = new Leaf({
  id: '',
  token: '',
}, {
  actions: {
    initToken(leaf, router) {
      const {id, token} = router.query;
      leaf.do.setId(id);
      leaf.do.setToken(token);
      router.push('/');
    }
  }
})

export const GlobalState = WithLocalState(() => globalLeaf, ({ leaf, children, ...values }) => {
  return (
    <GlobalProvider.Provider value={
      { globalLeaf: leaf, globalValue: values }
    }>
      {children}</GlobalProvider.Provider>
  )
});
