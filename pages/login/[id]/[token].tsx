import { GlobalProvider } from "../../../lib/globalState";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";


const Login = (params) => {

  const { globalLeaf, globalValue } = useContext(GlobalProvider)
  const router = useRouter();

  useEffect(() => {
    if (router.query.id && router.query.token) {
      globalLeaf.do.initToken(router );
    } else if (!globalValue.cookieChecked) {
      globalLeaf.do.initCookie();
    }
  }, [router.query])

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
