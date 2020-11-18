import knex from 'knex';
import knexConfig from '../../config/knex';
import { FormFields, Gender } from "../../components/Form/types"
import validator from 'validator';
import createTable from '../../lib/createTable';


export default async (req, res) => {
  const { body }: { body: FormFields } = req;

  let sanitised: FormFields = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    gender: Gender.SELECT,
    dob: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    comments: '',
  };
  
  for (const key in body) {
    sanitised[key] = validator.escape(body[key]);
  }

  // connect to DB
  const myKnex = knex(knexConfig);

  // check table exists
  await myKnex.schema.hasTable('person').then(function(exists) {
    if (!exists) createTable(myKnex);
  });

  // insert new person
  try {
    myKnex('person').insert({
      first_name: sanitised.firstName,
      surname: sanitised.lastName,
      email: sanitised.email,
      mobile: sanitised.mobile,
      gender: sanitised.gender,
      date_of_birth: sanitised.dob,
      comments: sanitised.comments
    }).then(() => {
      res.statusCode = 200
      res.json({ message: 'success' });
    }).catch(err => {throw Error(err)});
  } catch (err) {
    console.error(err);    
    res.statusCode = 500;
    res.json({ message: 'failure' });
  }
}
