import ButtonIcon from '../ButtonIcon';
import cs from 'classnames';
import { IconExit } from '../assets/icons';
import { Modal } from './ModalBase';
import { FC, HTMLAttributes } from 'react';

export type ModalHeaderItem = {
  icon: FC<HTMLAttributes<unknown>>;
  className?: string;
  onClick: () => void;
};

const ModalHeaderItemElement = ({ icon, className, onClick }: ModalHeaderItem) => {
  return (
    <ButtonIcon
      icon={icon}
      onClick={onClick}
      className={cs(className)}
      color="fill-white-blue"
      bgColor="bg-transparent"
      disabledBgColor="bg-transparent"
      size="small"
      hoverEffect="scaleDown"
      square
    />
  );
};

export const ModalHeader: Modal = ({
  title,
  headerLeftButton,
  headerRightButton,
  canDismiss,
  footerButtons,
  hideModal,
}) => {
  return (
    <div className="flex h-12 items-center px-2.5">
      {headerLeftButton && <ModalHeaderItemElement {...headerLeftButton} />}
      {title && <h5 className="grow pl-2 pt-px text-base !leading-none 2xl:pl-2.5">{title}</h5>}
      {headerRightButton && <ModalHeaderItemElement {...headerRightButton} />}
      {canDismiss && !footerButtons && (
        <ModalHeaderItemElement icon={IconExit} onClick={() => hideModal()} />
      )}
    </div>
  );
};
