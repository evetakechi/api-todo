import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://todo-db-f1335.firebaseio.com"
});
const ref = admin.database().ref().child('todo-list');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.server = http.createServer(app).listen(8887);
app.use(express.static(__dirname + '/view'));
console.log("Server running at port:8887");

app.get('/', (req,res) => {
  res.render('index.html');
})

app.get('/listalltodo', async (req, res) => {
  const dataTodo = await ref.once('value');
  res.send(dataTodo.val());
});

app.post ('/addnewtodo', async (req, res) => {
  //console.log(req.body);
  let param = req.body;
  await ref.push(param);
  res.send({code: 1 , message:"Success"});
  
});

app.delete('/deletetodo/:id', async (req, res) => {
  //console.log(req.params.id);
  const key = req.params.id;
  await ref.child(`/${key}`).remove();
  res.send({code: 1 , message:"Success"});
  
})

