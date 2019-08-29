const {expect} = require('chai');
const TyrDB = require('../../index');
const MemoryAdapter = require('../../src/adapters/MemoryAdapter/MemoryAdapter');
const Event = require('../../src/types/Event');

const myData = {
  name: 'mydoc',
  buffer:Buffer.from('Hey!'),
  string: 'heya',
  bool: true,
  null: null,
  undefined: undefined,
  array: [],
  object: {},
  number: 23,
  float: 23.4,
  otherStuff: -234344.4,
  myField: {
    a: {
      nested: {
        'hey': ['a', true, false, 1, 3, Buffer.from('Hey!')],
      }
    }
  }
};

const ids = [];

describe('TyrDB - Class', () => {
  let tyr;
  it('should work', function (done) {
    tyr = new TyrDB();

    expect(tyr.options).to.deep.equal({path: '.db', autoInitialize: true, autoConnect: true});
    expect(tyr.persistanceAdapter).to.deep.equal(new MemoryAdapter())
    expect(tyr.databases).to.deep.equal([])
    expect(tyr.databaseVersion).to.deep.equal('1.0.1');
    tyr.on('ready', () => {
      expect(tyr.state).to.deep.equal({
        isConnected: true,
        isConnecting: false,
      })
      done()
    })

  });
  it('should be able to listen', function (done) {
    const tyr2 = new TyrDB();
    tyr2.on('ready', () => {
      done()
    });
  })
  it('should be able to emit normal event', function (done) {
    const tyr2 = new TyrDB();
    tyr2.on('eventName', (event) => {
      expect(event).to.deep.equal({isSelected: true});
      done()
    });
    tyr2.emit('eventName', {isSelected: true});
  });
  it('should be able to emit event', function (done) {
    const tyr2 = new TyrDB();
    tyr2.on('eventName', (event) => {
      expect(event).to.deep.equal({isSelected: true});
      done()
    });
    tyr2.emit(new Event({name: 'eventName', payload: {isSelected: true}}));
  });
  it('should be able to create a db', async function () {
    const db = await tyr.db('db');
    expect(Object.assign({}, db)).to.deep.equal({name: 'db'});
    db.initialCreation = true;
  });
  it('should be able to get a created db', async function () {
    const db = await tyr.db('db');
    expect(Object.assign({}, db)).to.deep.equal({name: 'db', initialCreation: true});

  });
  it('should be able to create a collection', async function () {
    const db = await tyr.db('db');
    const col = await db.collection('col');
    expect(Object.assign({}, col)).to.deep.equal({
      name: 'col',
      documents: [],
      parentDatabaseName: 'db',
      binaryIndices: {},
      uniqueNames: []
    });
    col.initialCreation = true;
  });
  it('should be able to get a collection', async function () {
    const db = await tyr.db('db');
    const col = await db.collection('col');
    expect(Object.assign({}, col)).to.deep.equal({
      name: 'col',
      documents: [],
      parentDatabaseName: 'db',
      binaryIndices: {},
      uniqueNames: [],
      initialCreation: true
    });
  });
  it('should be able to create a document', async function () {
    const db = await tyr.db('db');
    const col = await db.collection('col');

    const insertRes = await col.insert(myData);

    expect(insertRes.result.length).to.equal(1);
    const doc = insertRes.result[0];
    expect(doc._fields).to.deep.equal([
          [ 'name', 3 ],
          [ 'buffer', 7 ],
          [ 'string', 3 ],
          [ 'bool', 1 ],
          [ 'null', 0 ],
          [ 'undefined', 4 ],
          [ 'array', 6 ],
          [ 'object', 5 ],
          [ 'number', 2 ],
          [ 'float', 2 ],
          [ 'otherStuff', 2 ],
          [ 'myField', 5 ]
        ]
    );
    expect(doc.data).to.deep.equal(myData);
    ids.push(doc._id.toString())

    expect(col.documents[doc._id]).to.deep.equal(doc.export());
    //todo : Should be a test of Document instead
    expect(Object.keys(doc.export())).to.deep.equal(['_id', '_meta', '_fields']);
  });
  it('should be able to get a document', async function () {
    const db = await tyr.db('db');
    const col = await db.collection('col');
    const doc = await col.get(ids[0]);
    expect(doc.data).to.deep.equal(myData)
  });
  it('should be able to find a document', async function () {
    const db = await tyr.db('db');
    const col = await db.collection('col');
    const doc = await col.find({'name': 'mydoc'});
    const docFromObjectid = await col.find({_id:ids[0]});
    expect(doc.data).to.deep.equal(myData)
    expect(docFromObjectid.data).to.deep.equal(myData)
  });
});
