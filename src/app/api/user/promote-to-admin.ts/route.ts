import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user.model';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  await dbConnect();

  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User promoted to admin successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}
