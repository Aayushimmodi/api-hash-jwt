# api-hash-jwt
Create Login, Register and Display API using JWT and Hash password

### JWT (Json Web Token) 
It is a stateless authentication mechanism i.e it maintains sessions in the
client-side itself instead of storing it in the server. used with authentication systems to make authenticated requests.
It consist of three parts — <b>header, payload, and signature.</b>
*  npm i jsonwebtoken --save
*  API is secure using <b>JsonWebToekn</b>

### Generate Hash Password using Bcrypt library 
using Bcyrpt library to hash and compare password.to store encrypted data in database.
*  npm i bcrypt --save
* const bcrypt = require('bcrypt');

#### Salt 
* Salt Round means cost factor.
* salt is a random value, and should differ for each calculation, so the
result should hardly ever be the same, even for equal passwords
