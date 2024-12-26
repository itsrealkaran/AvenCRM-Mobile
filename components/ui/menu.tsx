import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';

interface MenuProps {
  children: React.ReactNode;
}

interface MenuItemProps {
  children: React.ReactNode;
  onPress: () => void;
}

const MenuContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}>({ isOpen: false, setIsOpen: () => {} });

export function Menu({ children }: MenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <MenuContext.Provider value={{ isOpen, setIsOpen }}>
      <View>{children}</View>
    </MenuContext.Provider>
  );
}

Menu.Trigger = function Trigger({ children }: { children: React.ReactNode }) {
  const { setIsOpen } = React.useContext(MenuContext);
  return (
    <TouchableOpacity onPress={() => setIsOpen(true)}>
      {children}
    </TouchableOpacity>
  );
};

Menu.Content = function Content({ children }: { children: React.ReactNode }) {
  const { isOpen, setIsOpen } = React.useContext(MenuContext);
  return (
    <Modal visible={isOpen} transparent onRequestClose={() => setIsOpen(false)}>
      <TouchableOpacity 
        style={styles.overlay} 
        onPress={() => setIsOpen(false)}
      >
        <View style={styles.content}>
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

Menu.Item = function Item({ children, onPress }: MenuItemProps) {
  const { setIsOpen } = React.useContext(MenuContext);
  return (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => {
        onPress();
        setIsOpen(false);
      }}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
}); 