import admin from './users';

export default app => {
  app.use('/account', admin);
  
}
