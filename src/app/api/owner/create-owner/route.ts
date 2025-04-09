import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user.model';
import bcrypt from 'bcryptjs';
import Owner from '@/models/owner.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { name, email, password, phone, address, image, productsCategory, requestForApproval } = req.body;

      if (!name || !email || !password || !phone || !address || !productsCategory || !requestForApproval) {
        return res.status(400).json({
          success: false,
          message: 'Please fill all the fields',
        });
      }

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User does not exist. Please register as a user first',
        });
      }

      const existingVerifiedOwner = await Owner.findOne({ email, isApprovedOwner: true });
      if (existingVerifiedOwner) {
        return res.status(400).json({
          success: false,
          message: 'Owner already exists',
        });
      }

      const existingOwnerByEmail = await Owner.findOne({ email });
      if (existingOwnerByEmail) {
        const message = existingOwnerByEmail.isApprovedOwner
          ? 'Owner already exists'
          : 'Owner already exists but not approved. Please contact admin for approval';
        return res.status(400).json({
          success: false,
          message,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newOwner = await Owner.create({
        name,
        email,
        image,
        password: hashedPassword,
        phone,
        address,
        productsCategory,
        requestForApproval,
        isApprovedOwner: false,
      });
      await newOwner.save();

      return res.status(200).json({
        success: true,
        data: newOwner,
        ownerId: newOwner._id?.toString(),
        message: 'Owner registered successfully. Please wait for admin approval',
      });
    } catch (error) {
      console.error('Error in registering seller', error);
      return res.status(500).json({
        success: false,
        message: 'Error registering Seller',
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
