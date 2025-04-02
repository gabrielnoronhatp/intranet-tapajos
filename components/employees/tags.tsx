import { Form, Select, Tag } from 'antd';

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

export const CustomTagRender = (props: any) => {
  const { label, value, closable, onClose } = props;
  const colorIndex = value?.charCodeAt(0) % tagColors.length;
  const color = tagColors[colorIndex];

  return (
    <Tag color={color} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
      {label}
    </Tag>
  );
};
