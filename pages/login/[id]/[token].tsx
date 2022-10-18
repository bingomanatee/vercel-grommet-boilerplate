import { GlobalProvider } from "../../../lib/globalState";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";


const Login = (params) => {

  const { globalLeaf, globalValue } = useContext(GlobalProvider)
  const router = useRouter();

  const {authorized, cookieChecked} = globalValue;

  useEffect(() => {
    if (authorized) return;
    if (router.query.id && router.query.token) {
      globalLeaf.do.initToken(router);
    } else if (!cookieChecked) {
      globalLeaf.do.initCookie();
    }
  }, [router.query, cookieChecked, cookieChecked, authorized])

  if (globalValue.authorized === false) {
    router.push('/unauthorized');
    return '';
  }

  return (
    <pre>
     global value:  {JSON.stringify(globalValue, true, 5)} query:
      {JSON.stringify(router.query)}
    </pre>
  )
}

export default Login;
