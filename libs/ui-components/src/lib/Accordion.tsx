import { FunctionComponent, HTMLProps, ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ButtonIcon from './ButtonIcon';
import { IconArrowDown } from './assets/icons';
import cs from 'classnames';

export const AccordionGroup: FunctionComponent<HTMLProps<HTMLUListElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <ul className={cs('flex flex-col gap-2.5 lg:gap-3.5', className)} {...props}>
      {children}
    </ul>
  );
};

type ItemProps = {
  header: ReactNode;
  open?: boolean;
  arrow?: boolean;
  bodySpace?: string;
  openSpace?: boolean;
} & HTMLProps<HTMLLIElement>;

export const AccordionItem: FunctionComponent<ItemProps> = ({
  header,
  open = false,
  arrow = false,
  bodySpace = '0',
  openSpace = false,
  children,
  className,
  ...props
}) => {
  const [isOpen, setOpen] = useState<boolean>(open);

  return (
    <li
      className={cs(
        'group/accordion-item overflow-hidden rounded-2xl transition-[margin]',
        isOpen && 'open',
        isOpen &&
          openSpace &&
          '[&:not(:first-child)]:mt-1 lg:[&:not(:first-child)]:mt-2 [&:not(:last-child)]:mb-1 lg:[&:not(:last-child)]:mb-2',
        className,
      )}
      {...props}
    >
      {!arrow ? (
        <div className="cursor-pointer" onClick={() => setOpen(!isOpen)}>
          {header}
        </div>
      ) : (
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="grow">{header}</div>
          <ButtonIcon onClick={() => setOpen(!isOpen)} icon={IconArrowDown} className="shrink" />
        </div>
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, marginTop: 0 }}
            animate={{ height: `auto`, marginTop: bodySpace ? bodySpace : 0 }}
            exit={{ height: 0, marginTop: 0 }}
            transition={{ type: 'linear' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};
