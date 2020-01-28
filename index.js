const express = require('express');
const server = express();

var projects = [
    {
      id: 0,
      title: 'ProjetoPrincipal',
      tasks: []
    }
]
var contaReq = 0;
//Middlewares
server.use(express.json());
server.use(log);

function log (req, res, next){
  contaReq ++;
  console.log('Numero de Requisicoes: ' + contaReq)

  return next();
}

function verificaExistencia (req, res, next) {
  let index = projects.indexOf(projects.find(p => p.id == req.params.id));
  if (index == -1) {
    return res.status(404).json({error: 'Nao foi possivel encontrar o Projeto com o ID especificado'})
  }
  req.id = index;
  return next();
}

//Crud
//GET
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//POST
server.post('/projects', (req, res) => {
    var { title } = req.body;
    var project =  {
      id: projects.length + 1,
      title: title,
      tasks: []
    }

    projects.push(project)
    return res.json(project);
});

server.post('/projects/:id/task', verificaExistencia, (req, res) => {
  const { tasks } = req.body;
  projects[req.id].tasks.push(tasks);
  return res.json(projects[req.id]);
});

//PUT
server.put('/projects/:id',verificaExistencia, (req, res) => {
  const { title, tasks } = req.body;
  let aux = {
      id: req.id,
      title: title,
      tasks: tasks
  }
  projects[req.id] = aux;
  return res.json(projects)
});

//DELETE
server.delete('/projects/:id',verificaExistencia, (req, res) => {
  projects.splice(req.id, 1);
  return res.send();
});

server.listen(3000, (req, res) => {
  console.log('Servidor Ligado na Porta 3000')
})