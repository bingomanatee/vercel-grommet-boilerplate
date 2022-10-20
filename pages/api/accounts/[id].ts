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
  const { auth, token } = req.headers;
  const { id } = req.query;
  if (!(auth && token)) {
    console.log('no auth headers in  request: ', req);
    res.status(500).json({ error: 'unauthorized' });
    return;
  }

  if (req.method === 'GET') {

    console.log('accounts-- getting account from ', req.query);
    try {
      const { data, headers } = await axios.get(
        (process.env.API_ROOT || 'http://localhost:3040/') + 'admin/accounts/' + id,
        {
          headers: {
            auth, token
          }
        });

      console.log('accounts--- data retrieved:', data);
      res.status(200).json(data);
    } catch (err) {
      console.log("error getting tpus:", err);
      res.status(500).json({ error: err.message });
    }
  }

  if(req.method === 'POST') {
    console.log('accounts-- updating account from ', req.query, 'with', req.body);
    try {
      const { data, headers } = await axios.post(
        (process.env.API_ROOT || 'http://localhost:3040/') + 'admin/accounts/' + id,
        req.body,
        {
          headers: {
            auth, token
          }
        });

      console.log('accounts--- data retrieved:', data);
      res.status(200).json(data);
    } catch (err) {
      console.log("error updating account:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
}
