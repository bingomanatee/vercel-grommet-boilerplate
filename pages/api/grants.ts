// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from "axios";

type Data = {
  token_providers?: any[]
  message?: string,
}

async function grantDeleteHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  
}

export default async function grantHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let out;
  switch (res.method) {
    case 'GET':
      out = await grantGetHandler(req, res);
      break;

    case 'DELETE':
      out = await grantDeleteHandler(req, res);
      break;

    default:
      res.status(500).json({ error: 'unauthorized method' });
  }
  
  function grantGetHandler(  req: NextApiRequest,
                              res: NextApiResponse<Data>) {
  if (req.method !== 'GET') {
    res.status(404).send({ message: 'not found' });
    return;
  }

  const { auth, token } = req.headers;
  if (!(auth && token)) {
    console.log('no auth headers in  request: ', req);
    res.status(500).json({ error: 'unauthorized' });
    return;
  }
  console.log('tokenProviderHandler-- getting token providers from ');
  console.log(req.headers);

  try {
    const { data, headers } = await axios.get((process.env.API_ROOT || 'http://localhost:3040/') + 'admin/accounts', {
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
    res.status(500).json({ error: err.message });
  }

}
