// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from "axios";

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(404).send({ message: 'not found' });
    return;
  }

  const {email} = req.body;
  console.log('-- getting tokens for ', email);
  const { data } = await axios.post( process.env.API_ROOT + 'connect/create-bridge', {
    email
  });

  console.log('--- data retrieved:', data);
  res.status(200).json(data);
}
