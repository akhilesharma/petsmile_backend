const mongoose = require('mongoose');


// local connection with localdb
// const conn = mongoose.connect('mongodb://127.0.0.1:27017/petsmile', { useNewUrlParser: true, useUnifiedTopology: true });

//For local
// const conn = mongoose.connect('mongodb://PetworldUsr:PetsWorldpAss0505@177.71.138.20:27017/petsword_db', { useNewUrlParser: true, useUnifiedTopology: true })

//For server(Code Push)
const conn = mongoose.connect('mongodb://PetworldUsr:PetsWorldpAss0505@127.0.0.1:27017/petsword_db', { useNewUrlParser: true, useUnifiedTopology: true });



conn.then(() => {
    console.log(`Mongodb connected successfully.
😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀`);
}).catch(err => {
    console.log(err);
})

exports.mongoose = mongoose;
exports.conn = conn;