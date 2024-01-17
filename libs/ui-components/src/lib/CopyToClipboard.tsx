import Button from './Button';
import cs from 'classnames';
import { HTMLProps, FunctionComponent, useState } from 'react';

type Props = {
  value: string;
} & HTMLProps<HTMLDivElement>;

const CopyToClipboard: FunctionComponent<Props> = ({ value, className, ...props }) => {
  const [copyButtonLabel, setCopyButtonLabel] = useState<string>('COPY');

  return (
    <div className={cs('input disabled text-left', className)} {...props}>
      <p className="break-all text-sm">{value}</p>
      <Button
        size="small"
        bgColor="bg-50 hover:bg-40"
        color="text-10 hover:text-white-black"
        className="uppercase"
        onClick={() => {
          navigator.clipboard.writeText(value);

          setCopyButtonLabel('COPIED');
          setTimeout(() => {
            setCopyButtonLabel('COPY');
          }, 5000);
        }}
      >
        {copyButtonLabel}
      </Button>
    </div>
  );
};

export default CopyToClipboard;
