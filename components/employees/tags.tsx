import {  Tag } from 'antd';

const tagColors = [
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
  label: string;
  value: string;
  closable: boolean;
  onClose: () => void;
}

export const CustomTagRender = (props: CustomTagRenderProps) => {
  const { label, value, closable, onClose } = props;
  const colorIndex = value?.charCodeAt(0) % tagColors.length;
  const color = tagColors[colorIndex];

  return (
    <Tag color={color} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
      {label}
    </Tag>
  );
};
