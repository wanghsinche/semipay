// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createHmac } from 'node:crypto';

type Data = {
  name: string,
  code: string,
  saurce: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const code = createHmac('sha256', 'mykey').update('101').digest('base64');
  
  res.status(200).json({ name: 'John Doe', code,  saurce: '101'})
}
