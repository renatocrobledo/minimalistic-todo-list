
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app:server, todoList, } = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Tasks', () => {

  beforeEach((done) => {
		todoList.removeAll()
    .then((response, err) => {
      done();
    });
	});

  describe('/GET task', () => {
	  it('it should GET all the tasks', (done) => {
			chai.request(server)
		    .get('/tasks')
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
			  	res.body.length.should.be.eql(0);
		      done();
		    });
	  });
  });

  describe('/POST task', () => {
      it('it should not POST a task without Text key', (done) => {
        let task = {};

        chai.request(server)
            .post('/tasks')
            .send(task)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
              done();
            });
      });

      it('it should POST a task ', (done) => {
        let task = {
            text: "Something new!"
        };
          chai.request(server)
            .post('/tasks')
            .send(task)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('_id');
              res.body.should.have.property('createdAt');
              res.body.should.have.property('status');
              done();
            });
        });

  });


  describe('/GET/:id task', () => {
    it('it should GET a task by the given id', (done) => {
        todoList.insert({text: 'testing!'})
          .then((task) => {
            chai.request(server)
              .get(`/tasks/${task._id.toString()}`)
               .send({})
               .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('_id').eql(task._id.toString());
                  done();
               });
          });
    });
  });

  describe('/PUT/:id task', () => {
    it('it should UPDATE a task given the id', (done) => {
      todoList.insert({text: 'testing!'}).then((newTask)=>{
        chai.request(server)
          .put(`/tasks/${newTask._id.toString()}`)
          .send({text: "text updated!"})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Task updated!');
            done();
          });
      });
    });
  });

  describe('/DELETE/:id task', () => {
    it('it should DELETE a task given the id', (done) => {

      todoList.insert({text: 'testing!'}).then((newTask)=>{
        chai.request(server)
          .delete(`/tasks/${newTask._id.toString()}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Succesfully removed!');
            done();
          });
      });

    });
  });


});
