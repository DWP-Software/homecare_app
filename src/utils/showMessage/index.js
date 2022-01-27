import {showMessage as showToast} from 'react-native-flash-message';

export const showMessage = (message, type) => {
  showToast({
    message,
    type: type === 1 ? 'success' : 'danger',
    backgroundColor: type === 1 ? '#1ABC9C' : '#D9435E',
  });
};
