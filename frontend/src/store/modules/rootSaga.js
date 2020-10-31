import { all } from 'redux-saga/effects';

import auth from './auth/sagas';
import user from './user/sagas';

// esse * é chamado de generator no JS, é praticamente igual o async, porém mais poderoso
export default function* rootSaga() {
  // o yield é como se fosse o await
  return yield all([auth, user]);
}
