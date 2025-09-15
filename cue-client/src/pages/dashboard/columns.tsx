import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';
import { ConfirmUserDeleteDialog } from './confirm-user-delete-dialog';
import api from '@/api';

export type User = {
    id: number;
    name: string;
};

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'id',
        header: 'Id',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const user = row.original;
            const [showDeleteDialog, setShowDeleteDialog] = useState(false);

            const handleDeleteUser = async () => {
                try {
                    await api.delete(`/users/${user.id}`);
                    // @todo update local state
                } catch {
                    console.error('Failed to delete user:', user.name);
                }
            };

            return (
                <>
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <Link to={`/${user.name}`}>View profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                                    Delete user
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <ConfirmUserDeleteDialog
                        open={showDeleteDialog}
                        onOpenChange={setShowDeleteDialog}
                        userName={user.name}
                        onConfirm={handleDeleteUser}
                    />
                </>
            );
        },
    },
];
