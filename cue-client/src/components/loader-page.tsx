import { LoaderCircle } from 'lucide-react';

export default function LoaderPage() {
    return (
        <div className="flex justify-center items-center h-full">
            <LoaderCircle size={48} className="animate-spin" />
        </div>
    );
}
