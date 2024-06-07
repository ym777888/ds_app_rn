// ModalDialog.js
import React from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import { useModal, ModalManager } from './ModalManager';

const ModalDialog = () => {
  const { modal, hideModal, showModal } = useModal();

  // Set the global handlers
  React.useEffect(() => {
    ModalManager.setShowModalHandler(showModal);
    ModalManager.setHideModalHandler(hideModal);
  }, [showModal, hideModal]);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={modal.visible}
      onRequestClose={hideModal}
    >
      <View style={styles.modalBackground}>
        <View style={styles.dialogContainer}>
          <Text style={styles.message}>{modal.message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => {
              hideModal();
              if (modal.button1Action) modal.button1Action();
            }}>
              <View style={styles.btn1}>
                <Text style={styles.btnTxt}>{modal.button1Text}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              hideModal();
              if (modal.button2Action) modal.button2Action();
            }}>
              <View style={[styles.btn1, {backgroundColor: '#eeeeee'}]}>
                <Text style={[styles.btnTxt, {color: 'black'}]}>{modal.button2Text}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  message: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
    color: 'black'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  btn1: {
    width: 90,
    height: 24,
    backgroundColor: '#CC3333',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    borderRadius: 5,
  },
  btnTxt: {
    color: 'white'
  }
});

export default ModalDialog;
