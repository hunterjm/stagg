import classNames from 'classnames';
import React, { useEffect, ReactNode, MouseEvent } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  id?: string;
  className?: string;
  children?: ReactNode;
  handleClose: (event: any) => void; // Events seems to conflict each other, that's why I used any
  handleCloseByButton?: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
  show?: boolean;
  closeHidden?: boolean;
  video?: string;
  videoTag?: 'iframe' | 'video';
}

export const Modal = ({
  className,
  children,
  handleClose,
  handleCloseByButton,
  show = false,
  closeHidden,
  video,
  videoTag = 'iframe',
  ...props
}: ModalProps) => {
  useEffect(() => {
    document.addEventListener('keydown', keyPress);
    document.addEventListener('click', stopProgagation);
    return () => {
      document.removeEventListener('keydown', keyPress);
      document.removeEventListener('click', stopProgagation);
    };
  });

  useEffect(() => {
    handleBodyClass();
  }, [show]);

  const handleBodyClass = () => {
    if (document.querySelectorAll('.modal.is-active').length > 0) {
      document.body.classList.add('modal-is-active');
    } else {
      document.body.classList.remove('modal-is-active');
    }
  };

  const keyPress = (event: KeyboardEvent) => {
    event.keyCode === 27 && handleClose(event);
  };

  // Events seems to conflict each other, that's why I used any
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const stopProgagation = (event: any) => {
    event.stopPropagation();
  };

  const classes = classNames(
    'modal',
    show && 'is-active',
    video && 'modal-video',
    className
  );

  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      {...props}
      className={classes}
      onClick={handleClose}
      data-testid="modal"
    >
      <div className="modal-inner" onClick={stopProgagation}>
        {video ? (
          <div className="responsive-video">
            {videoTag === 'iframe' ? (
              <iframe
                title="video"
                src={video}
                frameBorder="0"
                allowFullScreen
              />
            ) : (
              // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/media-has-caption
              <video v-else controls src={video} />
            )}
          </div>
        ) : (
          <>
            {!closeHidden && (
              <button
                type="button"
                className="modal-close"
                aria-label="close"
                onClick={handleCloseByButton}
              />
            )}
            <div className="modal-content">{children}</div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};
