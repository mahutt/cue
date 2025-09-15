import api from '@/api';

import { useEffect, useState } from 'react';
import { columns as userColumns, User } from './user-table/columns';
import { DataTable as UserDataTable } from './user-table/data-table';
import { DataTable as MessageDataTable } from './message-table/data-table';
import { columns as messageColumns } from './message-table/columns';
import { Message } from '@/types';

export default function Dashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse, messagesResponse] = await Promise.all([
                    api.get<User[]>(`/api/users`, {}),
                    api.get<Message[]>(`/messages`, {}),
                ]);

                setUsers(usersResponse.data);
                setMessages(messagesResponse.data);
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
                <UserDataTable columns={userColumns} data={users} />
            </div>
            <div>
                <p className="text-gray-500 ml-1">Messages</p>
                <MessageDataTable columns={messageColumns} data={messages} />
            </div>
        </div>
    );
}
