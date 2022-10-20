// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from "axios";

type Data = {
  sharedToken: number,
  expiresAt: string
}

export default async function tokenProvidersHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(404).send({ message: 'not found' });
    return;
  }

  const {auth, token} = req.headers;
  console.log('relaying shared for ', auth, token);
  if (!(auth && token)) {
    res.status(500).json({error: 'unauthorized'});
    return;
  }

  try {
    const { data, headers } = await axios.post( (process.env.API_ROOT || 'http://localhost:3040/')
      + 'token-providers/shared-token', req.body, {
      headers: {
        auth, token
      }
    });

    console.log('share--- data retrieved:', data, 'headers are ', headers);
    res.status(200).json(data);
  } catch (err) {
    console.log("error getting share:", err);
    res.status(500).json({error: err.message});
  }

}
