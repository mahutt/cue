import api from '@/api';

import { useEffect, useState } from 'react';
import { columns, User } from './columns';
import { DataTable } from './data-table';

export default function Dashboard() {
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get<User[]>(`/api/users`, {});
                const users = response.data;
                setData(users);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="container mx-auto py-10">Loading...</div>;
    }

    return (
        <div className="max-w-screen-xl mx-auto px-4 flex flex-col gap-6">
            <div className="font-semibold text-3xl">Developer Dashboard</div>
            <div>
                <p className="text-gray-500 ml-1">Users</p>
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    );
}
