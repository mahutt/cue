import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { useNotification } from '@/hooks/notification-hook';
import api from '@/api';
import { Badge } from '../ui/badge';

export default function MessageForm() {
    const { notify } = useNotification();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setIsSubmitting(true);
        try {
            await api.post('/messages', { content: content.trim() });
            setContent('');
            notify('Message submitted successfully!');
        } catch {
            notify('Could not submit your message at this time.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 mb-4">
            <div className="ms-1 flex justify-between items-center">
                <label htmlFor="messageContent" className="text-gray-500">
                    Requests & feedback
                </label>
                <Badge>New!</Badge>
            </div>
            <Textarea
                id="messageContent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                disabled={isSubmitting}
            />

            <Button variant="secondary" onClick={handleSubmit} disabled={isSubmitting || !content.trim()}>
                <Send className="" size={16} />
                Submit
            </Button>
        </div>
    );
}
