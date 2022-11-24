import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//install the Mongo library
const mongoUrl = process.env.MONGO_URL || "mongodb+srv://Paprika:Hellotomorrow.2021@cluster0.6gvgrxz.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }) //always the same set up
mongoose.Promise = Promise //always the same set up

const Animal = mongoose.model('Animal', {
  id: Number,
  name: String,
  age: Number,
  isFurry: Boolean
})


Animal.deleteMany().then(() => {
new Animal ({ id: 1, name: 'Alfons', age: 2, isFurry: true }).save()
new Animal ({ id: 2, name: 'Lucy', age: 5, isFurry: true }).save()
new Animal ({ id: 3, name: 'Goldy the goldsfish', age: 1, isFurry: false }).save()
})

// Start defining your routes here
app.get("/", (req, res) => {
  Animal.find().then(animals => {
    res.json(animals)
  })
});

//Damien checking the database is in good state
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
  res.status(503).json({ error: 'Service unavailable'})
}
})

app.get("/:name", (req, res) => { 
Animal.findOne({name: req.params.name}).then(animal => {
  try {
  if(animal) {
    res.json(animal)
  } else {
    res.status(404).json({error: 'Not found'})
  }
} catch (err) {  //does not work as I do not use asynch
  res.status(400).json({error: 'invalid name'})
}
})
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
