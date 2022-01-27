import Axios from 'axios';
import {API_HOST} from '../../config';
import { endpoint } from '../../config/API/service';
import {getData, showMessage} from '../../utils';

export const getOrders = () => (dispatch) => {
  getData('token').then((resToken) => {
    Axios.get(`${API_HOST.url}/transaction`, {
      headers: {
        Authorization: resToken.value,
      },
    })
      .then((res) => {
        dispatch({type: 'SET_ORDER', value: res.data.data.data});
      })
      .catch((err) => {
        showMessage(
          `${err?.response?.data?.message} on Transaction API` ||
            'Terjadi Kesalahan di API Transaction',
        );
      });
  });
};

// 16258054093

// 70012
// 397518022369

export const getInProgress = () => (dispatch) => {
  getData('token').then((resToken) => {
      Axios.get(endpoint.order_income, {
        headers: {
          Authorization: resToken.value,
        },
      })
      .then((res) => {
        dispatch({
          type: 'SET_IN_PROGRESS',
          value: [res.data.orders],
        });
      })
      .catch((err) => {
        showMessage(
          `${err?.response?.data?.message} on In Progress API` ||
            'Terjadi Kesalahan di In Progress API',
        );
      });
  });
};

export const getPastOrders = () => (dispatch) => {
  getData('token').then((resToken) => {
    Axios.all([
      Axios.get(`${API_HOST.url}/transaction?status=CANCELLED`, {
        headers: {
          Authorization: resToken.value,
        },
      }),
      Axios.get(`${API_HOST.url}/transaction?status=DELIVERED`, {
        headers: {
          Authorization: resToken.value,
        },
      }),
    ])
      .then(
        Axios.spread((res1, res2) => {
          const cancelled = res1.data.data.data;
          const delivered = res2.data.data.data;
          dispatch({
            type: 'SET_PAST_ORDERS',
            value: [...cancelled, ...delivered],
          });
        }),
      )
      .catch((err) => {
        showMessage(
          `${err?.response?.data?.message} on Past Order API` ||
            'Terjadi Kesalahan di API Past Order',
        );
      });
  });
};
