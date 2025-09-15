import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Check, Copy, Trash2 } from 'lucide-react';
import { Message } from '@/types';
import { useState } from 'react';

export const columns: ColumnDef<Message>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'content',
        header: 'Content',
        cell: ({ row }) => {
            const message = row.original;
            return <p className="text-sm text-wrap">{message.content}</p>;
        },
    },
    {
        accessorKey: 'username',
        header: 'Username',
        cell: ({ row }) => {
            const message = row.original;
            return message.user_id ? (
                <Badge variant="secondary">{message.username ?? message.user_id}</Badge>
            ) : (
                <Badge variant="outline">System</Badge>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Written',
        cell: ({ row }) => {
            const message = row.original;
            const date = new Date(message.created_at);
            return <div className="text-sm text-gray-600">{date.toLocaleDateString()}</div>;
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const message = row.original;
            const [copied, setCopied] = useState(false);

            return (
                <div className="flex justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            navigator.clipboard.writeText(message.content);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        title="Copy content"
                    >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => {
                            // Add delete logic here
                            console.log('Delete message:', message.id);
                        }}
                        title="Delete message"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
