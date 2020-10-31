// o call é para fazer chamadas de meotodos assincronos
// o put é para fazer chamadas a uma action do redux
import { takeLatest, call, put, all } from 'redux-saga/effects';

import { toast } from 'react-toastify';
import history from '~/services/history';
import api from '~/services/api';
import { signInSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;
    /**
     * devido a utilizacao do call, a chamada do metodo api.post mudou
     * o normal seria: api.post('sessions', {email, password})
     * */
    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    // seta o token nos headers
    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(signInSuccess(token, user));

    if (user.adresses.length === 0) history.push('/adresses/new');
    else history.push('/catalog');
  } catch (err) {
    toast.error('E-mail or password is wrong!');
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, last_name, telephone, email, password } = payload;

    // const response =
    yield call(api.post, 'users', {
      name,
      last_name,
      telephone,
      email,
      password,
    });

    history.push('/');
  } catch (err) {
    const errorMessage = err.response.data.error;

    toast.error(errorMessage, {
      autoClose: 5000,
    });
    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

// lembrando, o persist/REHYDRATE é uma action que é executada assim que a aplicacao
// inicia, vai buscar os dados do local storage
export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
