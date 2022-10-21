// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from "axios";

type Data = {
  token_providers?: any[]
  message?: string,
}


export default async function grantHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { auth, token } = req.headers;
  if (!(auth && token)) {
    console.log('grants[id] no auth headers in  request: ', req);
    res.status(500).json({ error: 'unauthorized' });
    return;
  }
  let out;
  switch (req.method) {
    case 'GET':
      out = await grantGetHandler(req, res);
      break;

    case 'DELETE':
      out = await grantDeleteHandler(req, res);
      break;

    default:
      res.status(500).json({ error: 'unauthorized method', method: req.method });
  }
}

async function grantDeleteHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query;
  const { auth, token } = req.headers;
  console.log('--- grantsDeleteHandler:', id, auth, token);
  try {
    const { data, headers } = await axios.delete(`${process.env.API_ROOT || 'http://localhost:3040/'}grants/${id}`,
      {
        headers: {
          auth, token
        }
      });

    console.log('grant delete ', id, '--- data retrieved:', data);
    res.status(200).json(data);
  } catch (err) {
    console.log("error deleting grants:", err);
    res.status(500).json({ error: err.message });
  }
}

async function grantGetHandler(req: NextApiRequest,
                         res: NextApiResponse<Data>) {
  const { id } = req.query;
  const { auth, token } = req.headers;
  try {
    const { data, headers } = await axios.get(`${process.env.API_ROOT || 'http://localhost:3040/'}admin/grants/${id}`,
      {
        headers: {
          auth, token
        }
      });

    console.log('grants--- data retrieved:', data);
    res.status(200).json(data);
  } catch (err) {
    console.log("error getting grants:", err);
    res.status(500).json({ error: err.message });
  }

}
