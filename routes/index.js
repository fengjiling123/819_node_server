import admin from './users';
import information from './information';;
import upload from './upload';

export default app => {
  app.use('/account', admin);
  app.use('/news', information);
  app.use('/upload', upload);
}
