// ModalManager.js
import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    visible: false,
    message: '',
    button1Text: '',
    button1Action: null,
    button2Text: '',
    button2Action: null,
  });

  const showModal = (message, button1Text='确定', button1Action=null, button2Text='取消', button2Action=null) => {
    setModal({
      visible: true,
      message,
      button1Text,
      button1Action,
      button2Text,
      button2Action,
    });
  };

  const hideModal = () => {
    setModal({
      visible: false,
      message: '',
      button1Text: '',
      button1Action: null,
      button2Text: '',
      button2Action: null,
    });
  };

  return (
    <ModalContext.Provider value={{ modal, showModal, hideModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

export const ModalManager = {
  showModal: null,
  hideModal: null,
  setShowModalHandler: (handler) => {
    ModalManager.showModal = handler;
  },
  setHideModalHandler: (handler) => {
    ModalManager.hideModal = handler;
  },
};
