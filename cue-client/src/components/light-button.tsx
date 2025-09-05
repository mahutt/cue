import { ButtonHTMLAttributes } from 'react';

type LightButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

export default function LightButton(props: LightButtonProps) {
    const { children, ...rest } = props;
    return (
        <button
            className="px-[0.75rem] py-[0.375rem] bg-gray-100 border-[1px] border-gray-100 rounded hover:bg-gray-200 hover:border-gray-300"
            {...rest}
        >
            {children}
        </button>
    );
}
