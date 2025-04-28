import { Tag } from 'antd';
import { ReactNode } from 'react';

export const tagColors = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
];

interface CustomTagRenderProps {
    label: ReactNode;
    value: string;
    closable: boolean;
    onClose: () => void;
}

export const CustomTagRender = (props: CustomTagRenderProps) => {
    const { label, closable, onClose } = props;
    const labelStr = label ? String(label) : '';

    return (
        <Tag closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
            {labelStr}
        </Tag>
    );
};
