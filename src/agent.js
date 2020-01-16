import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);
const USER_API = 'http://localhost:4000';

//const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${USER_API}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${USER_API}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${USER_API}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${USER_API}${url}`, body).use(tokenPlugin).set('Content-Type', 'application/json').then(responseBody)
};

export const Auth = {
  current: () =>
    requests.get('/user'),
  login: (email, password) =>
    requests.post('/user/login', { user: { email, password } }),
  register: (firstname, lastname, email, password, role) =>
    requests.post('/user/create', { user: { firstname, lastname, email, password, role } }),
  logout: () =>
    requests.post('/user/logout', {}),
  save: user =>
    requests.put('/user/update', { user }),
  deactivate: (email) =>
    requests.put('/user/deactivate', { email }),
  reactivate: (email) =>
    requests.put('/user/reactivate', { email })
};

const Referent = {
  register: (firstname, lastname, title, workphone, cellphone, fax, email, preferences) =>
    requests.post('/referent/create', { referent: { firstname, lastname, title, workphone, cellphone, fax, email, preferences } }),
  associate: (organismeId, email) =>
    requests.post('/referent/organismereferent', { association: { organismeId, email } }),
  all: () =>
    requests.post('/referents', {}),
  save: referent =>
    requests.put('/referent/update', { referent }),
  clear: (email) =>
    requests.del('/referent/clearpreferences', { association: email }),
  delete: id =>
    requests.del('/referent/delete', { id }),
  preference: (preferenceId, email) =>
    requests.post('/referent/preferencereferent', { association: { preferenceId, email } })
};

const OrganismeReferent = {
  register: (name, email, address, phone, fax, website, state, organisme) =>
    requests.post('/organismereferent/create', { organismeReferent: { name, email, address, phone, fax, website, state, organisme } }),
  all: () =>
    requests.post('/organismereferents', {}),
  save: organismeReferent =>
    requests.put('/organismereferent/update', { organismeReferent }),
  delete: id =>
    requests.del('/organismereferent/delete', { id })
};

const Organisme = {
  register: (name, email, address, phone, fax) =>
    requests.post('/organisme/create', { organisme: { name, email, address, phone, fax } }),
  all: () =>
    requests.post('/organismes', {}),
  save: organisme =>
    requests.put('/organisme/update', { organisme }),
  delete: id =>
    requests.del('/organisme/delete', { id })
};

const PointService = {
  register: (name, email, phone, fax, nocivique, street, city, province, postalcode) =>
    requests.post('/pointservice/create', { pointService: { name, email, phone, fax, nocivique, street, city, province, postalcode} }),
  all: () =>
    requests.post('/pointservices', {}),
  save: pointService =>
    requests.put('/pointservice/update', { pointService }),
  delete: id =>
    requests.del('/pointservice/delete', { id })
};

const Service = {
  register: (name, description, tarifParent, tarifCISSS, state, stateSubvention, datePrice) =>
    requests.post('/service/create', { service: { name, description, tarifParent, tarifCISSS, state, stateSubvention, datePrice} }),
  all: () =>
    requests.post('/services', {}),
  save: service =>
    requests.put('/service/update', { service }),
  delete: id =>
    requests.del('/service/delete', { id })
};

const DemandeService = {
  register: (serviceType, noDossierFamille, date, frequence, assumeFrais, motifs, transport, parent, secondParent, enfants, dispoFirstParent, dispoSecondParent) =>
    requests.post('/demandeservice/create', { demandeservice: { serviceType, noDossierFamille, date, frequence, assumeFrais, motifs, transport, parent, secondParent, enfants, dispoFirstParent, dispoSecondParent} }),
  all: () =>
    requests.post('/demandeservices', {}),
  save: (id, date, frequence, assumeFrais, motifs, transport, parent, secondParent, enfants, dispoFirstParent, dispoSecondParent) =>
    requests.put('/demandeservice/update', { demandeservice: { id, date, frequence, assumeFrais, motifs, transport, parent, secondParent, enfants, dispoFirstParent, dispoSecondParent} }),
  delete: id =>
    requests.del('/demandeservice/delete', { id }),
  addMotif: (motif) =>
    requests.post('/motifs/add', {newMotif: motif})
};

const Users = {
  all: () =>
    requests.get('/users')
};

export default {
  Auth,
  Users,
  Referent,
  OrganismeReferent,
  Organisme,
  PointService,
  Service,
  DemandeService,
  setToken: _token => { token = _token; }
};
