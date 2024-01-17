import cs from 'classnames';
import { Modal } from './ModalBase';

interface ModalFooterItemBase {
  text: string;
  className?: string;
}

interface ModalFooterButtonItem extends ModalFooterItemBase {
  url?: never;
  onClick?: () => void;
}

interface ModalFooterLinkItem extends ModalFooterItemBase {
  url: string;
  onClick?: never;
}

export type ModalFooterItem = ModalFooterButtonItem | ModalFooterLinkItem;

const ModalFooterItemElement = ({ text, className, url, onClick }: ModalFooterItem) => {
  const classNames =
    'border-0 border-r border-50 last:border-r-0 p-3 text-base font-medium text-center text-magenta [&:not(:last-child):first-child]:text-5 disabled:text-30 disabled:pointer-events-none bg-80/30 hover:bg-60 transition-color';
  if (url) {
    return (
      <a className={cs(classNames, className)} href={url} target="_blank" rel="noreferrer">
        {text}
      </a>
    );
  }
  return (
    <button className={cs(classNames, className)} onClick={onClick} disabled={!onClick}>
      {text}
    </button>
  );
};

export const ModalFooter: Modal = ({ footerButtons }) => {
  if (!footerButtons) return null;
  return (
    <div className="flex items-center [&>*]:grow">
      {footerButtons.map((item, index) => (
        <ModalFooterItemElement key={index} {...item} />
      ))}
    </div>
  );
};
