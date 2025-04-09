'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle2, Crown, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';

interface Owner {
    _id: string;
    name: string;
    email: string;
    isApproved: boolean;
    isAdmin: boolean;
}
export interface EnrichedOrder {
    _id: string;
    name: string;
    price: number;
    image: string;
    isDelivered: boolean;
  }
  
  export interface Order {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    orders: EnrichedOrder[];
  }
  
interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}


const AdminDashboard = () => {
    const { data: session } = useSession()
    const userId = session?.user?.id as string
    const [owners, setOwners] = useState<Owner[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]); // Adjust the type as per your order structure

    useEffect(() => {
        fetchData();
        getOrders(); // Fetch orders when the component mounts
        
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            //   const [ownersRes, usersRes] = await Promise.all([
            //     axios.get('/api/admin/get-owners'),
            //     axios.get('/api/admin/get-users')
            //   ]);
            const ownersRes = await axios.get('/api/admin/get-owners');
            const usersRes = await axios.get('/api/admin/get-users');
            setOwners(ownersRes.data.owners);
            setUsers(usersRes.data.users);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const approveOwner = async (ownerId: string) => {
        try {
            await axios.post('/api/admin/approve-owner', { ownerId });
            toast.success('Owner approved successfully');
            fetchData();
        } catch (err) {
            console.error('Error approving owner:', err);
            toast.error('Failed to approve owner');
        }
    };
     
    const getOrders = async () => {
        try {
            const response = await axios.get('/api/admin/get-orders');
            const userorders = response.data.users;
            setOrders(userorders);
        } catch (err) {
            console.error('Error fetching orders:', err);
            toast.error('Failed to fetch orders');
        }
    }
    const promoteToAdmin = async (id: string, type: 'owner' | 'user') => {
        if (type === 'owner') return toast.error('Only users can be promoted to admin');
        try {
            await axios.put(`/api/admin/promote-to-admin`, { id });
            toast.success(`Promoted user to admin`);
            fetchData();
        } catch (err) {
            console.error(`Failed to promote user:`, err);
            toast.error(`Failed to promote user`);
        }
    };

  

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Image src="/logo.png" alt="Logo" width={50} height={50} />
                    <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                        ZaiqaExpress Admin Dashboard
                    </h1>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
                </div>
            ) : (
                <div className="space-y-10">
                    {/* Owners */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Owners</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {owners.map((owner) => (
                                <Card key={owner._id} className="p-4 space-y-2">
                                    <CardContent className="space-y-2">
                                        <h3 className="text-lg font-bold">{owner.name}</h3>
                                        <p>{owner.email}</p>
                                        <div className="flex gap-2 flex-wrap">
                                            <Badge variant={owner.isApproved ? 'default' : 'destructive'}>
                                                {owner.isApproved ? 'Approved' : 'Unapproved'}
                                            </Badge>

                                        </div>

                                        {!owner.isApproved && (
                                            <Button
                                                size="sm"
                                                onClick={() => approveOwner(owner._id)}
                                                className="cursor-pointer w-full"
                                            >
                                                <CheckCircle2 className="cursor-pointer w-4 h-4 mr-2" /> Approve Owner
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Users */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Users</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {users.map((user) => (
                                <Card key={user._id} className="p-4 space-y-2">
                                    <CardContent className="space-y-2">
                                        <h3 className="text-lg font-bold">{user.name}</h3>
                                        <p>{user.email}</p>
                                        <div className="flex gap-2">
                                            {user.isAdmin && <Badge className="bg-yellow-500">Admin</Badge>}
                                        </div>

                                        {!user.isAdmin && (
                                            <Button
                                                size="sm"
                                                onClick={() => promoteToAdmin(user._id, 'user')}
                                                className="w-full cursor-pointer"
                                            >
                                                <Crown className="w-4 h-4 mr-2" /> Promote to Admin
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div>
                    <h2 className="text-2xl font-semibold mb-4">Orders</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {orders.map((order) => (
                                <Card key={order._id} className="p-4 space-y-2">
                                    <CardContent className="space-y-2">
                                        <h2 className='text-lg font-bold'>Purchaser And Order Details </h2>
                                        <h3 className="text-lg font-bold">{order.name}</h3>
                                        <p>{order.email}</p>
                                        <div className="flex gap-2">
                                            {order.phone && <Badge className="bg-yellow-500">Phone: {order.phone}</Badge>}
                                            {order.address && <Badge className="bg-yellow-500">Address: {order.address}</Badge>}
                                        </div>
                                       <h2 className='text-lg font-bold'>Ordered Items</h2>
                                       {order.orders.map((item) => (
                                            <div key={item._id} className="flex items-center gap-2 mb-2">
                                                <Image src={item.image} alt={item.name} width={50} height={50} />
                                                <div>
                                                    <p>{item.name}</p>
                                                    <p>Price:PKR-{item.price}</p>
                                                    <p>Status: {item.isDelivered ? 'Delivered' : 'Pending'}</p>
                                                </div>
                                                </div>
                                       ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    <div className="text-center">
                        <Link href={`/track-parcel/${userId}`}>
                        <Button  className="mt-6">
                            <Truck className="cursor-pointer w-4 h-4 mr-2" /> Track Orders
                        </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
