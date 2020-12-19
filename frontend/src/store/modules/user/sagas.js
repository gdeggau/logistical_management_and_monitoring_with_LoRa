import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '~/services/api';

import { updateProfileSuccess, updateProfileFailure } from './actions';

export function* updateProfile({ payload }) {
  try {
    const {
      name,
      last_name,
      email,
      telephone,
      avatar_id,
      ...rest
    } = payload.data;
    // console.log(payload.data);

    // serve para unir dois objetos
    const profile = {
      name,
      last_name,
      email,
      telephone,
      avatar_id,
      ...(rest.oldPassword ? rest : {}),
    };

    const response = yield call(api.put, 'users', profile);

    toast.success('Perfil atualizado!');

    yield put(updateProfileSuccess(response.data));
  } catch (err) {
    toast.error('Ocorreu um erro ao atualizar o perfil, verifique seus dados!');
    yield put(updateProfileFailure());
  }
}

export default all([takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile)]);
