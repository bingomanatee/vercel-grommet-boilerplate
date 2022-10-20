// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from "axios";

type Data = {
  token_providers?: any[]
  message?: string,
}

export default async function tokenProvidersHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    res.status(404).send({ message: 'not found' });
    return;
  }

  const {auth, token} = req.headers;
  if (!(auth && token)) {
    console.log('no auth headers in  request: ', req);
    res.status(500).json({error: 'unauthorized'});
    return;
  }
  console.log('tokenProviderHandler-- getting token providers from ');
  console.log(req.headers);

  try {
    const { data, headers } = await axios.get( (process.env.API_ROOT || 'http://localhost:3040/') + 'admin/accounts', {
      headers: {
        auth, token
      }
    });

    console.log('accounts--- data retrieved:', data, 'headers are ', headers);
    if ('auth-expires' in headers) {
      res.setHeader('auth-expires', headers['auth-expires'])
    }
    res.status(200).json(data);
  } catch (err) {
    console.log("error getting tpus:", err);
    res.status(500).json({error: err.message});
  }

}
