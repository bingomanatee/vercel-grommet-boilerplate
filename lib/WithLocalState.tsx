import { useEffect, useMemo, useState } from "react";
import { Leaf } from "@wonderlandlabs/forest";

const NOREDUCER = (_leaf, value) => {
  return value;
}

export default function WithLocalState(leafFn, View){

  const WithState =  (params) => {

    const leaf = useMemo(() => {
      return leafFn(params, Leaf)
    }, [params])

    const [value, setValue] = useState(leaf.value);

    useEffect(() => {
      const sub = leaf.subscribe(setValue);
      return () => sub.unsubscribe();
    }, [leaf]);


    return <View {...params} leaf={leaf} {...value} />
  }

  return WithState;
}
