import { ModalFooterItem, ModalFooter } from './ModalFooter';
import { ModalHeaderItem, ModalHeader } from './ModalHeader';
import cs from 'classnames';
import { FunctionComponent, ReactNode } from 'react';

export type ModalComponentBaseProps = {
  hideModal: () => void;
  setDismissible: (dismissible: boolean) => void;
};
// eslint-disable-next-line @typescript-eslint/ban-types
export type ModalComponent<T = {}> = FunctionComponent<T & ModalComponentBaseProps>;

type ModalProps = {
  title?: string;
  header?: ReactNode;
  canDismiss?: boolean;
  headerLeftButton?: ModalHeaderItem;
  headerRightButton?: ModalHeaderItem;
  footerButtons?: ModalFooterItem[];
  bottomText?: string;
  bodyClassName?: string;
  expandBody?: boolean;
  children?: ReactNode;
};

export type Modal = typeof Modal;
export const Modal: ModalComponent<ModalProps> = (props) => {
  const {
    title,
    header,
    canDismiss = true,
    headerLeftButton,
    headerRightButton,
    footerButtons,
    bottomText,
    bodyClassName,
    expandBody,
    children,
  } = props;

  return (
    <>
      <div className="bg-70 [&>*:not(:last-child)]:border-50 relative flex w-full flex-col items-stretch overflow-hidden rounded-2xl [&>*:not(:last-child)]:border-b [&>*]:w-full">
        {(title || headerLeftButton || headerRightButton || canDismiss) && (
          <ModalHeader {...props} />
        )}
        {header && header}
        <div
          className={cs(
            'flex flex-col gap-4 overflow-y-auto p-4 lg:max-h-[28rem] 2xl:p-5',
            header ? 'max-h-[20rem] lg:max-h-[22rem]' : 'max-h-[26rem] lg:max-h-[28rem]',
            expandBody && header
              ? 'min-h-[19rem] lg:min-h-[22rem]'
              : expandBody && 'min-h-[22rem] lg:min-h-[28rem]',
            bodyClassName,
          )}
        >
          {children}
        </div>
        {footerButtons && <ModalFooter {...props} />}
      </div>
      {bottomText && <p className="mt-2 text-center text-sm">{bottomText}</p>}
    </>
  );
};
