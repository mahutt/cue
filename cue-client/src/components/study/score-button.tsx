import { Frown, LucideIcon, Meh, Smile } from 'lucide-react';

const iconByScore: Record<number, LucideIcon> = {
    0: Frown,
    1: Meh,
    2: Smile,
};

export default function ScoreButton({
    score,
    updateScore,
}: {
    score: number;
    updateScore: (score: number) => Promise<void>;
}) {
    if (score < 0 || score > 2) return null;
    const Icon = iconByScore[score];
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                updateScore(score);
            }}
            aria-label={`Set score ${score}`}
            className="text-white bg-black w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-gray-800 hover:scale-105 active:scale-95"
        >
            <Icon size={16} />
        </button>
    );
}
