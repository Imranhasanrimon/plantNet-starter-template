require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const morgan = require('morgan')

const port = process.env.PORT || 9000
const app = express()
// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())
// app.use(morgan('dev'))

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded
    next()
  })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7hbnv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
async function run() {
  try {
    const usersCollection = client.db('plantNetDB').collection('users');
    const plantsCollection = client.db('plantNetDB').collection('plants');
    const ordersCollection = client.db('plantNetDB').collection('orders');

    //get all users
    app.get('/users/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { email: { $ne: email } }
      const result = await usersCollection.find(query).toArray();
      res.send(result)
    })

    //get  user role
    app.get('/users/role/:email', async (req, res) => {
      const email = req.params.email;
      const result = await usersCollection.findOne({ email });
      res.send({ role: result?.role })
    })

    //get all plants
    app.get('/plants', async (req, res) => {
      const result = await plantsCollection.find().toArray();
      res.send(result)
    })

    //get a single plant
    app.get('/plants/:id', async (req, res) => {
      const id = req.params.id;
      const result = await plantsCollection.findOne({ _id: new ObjectId(id) });
      res.send(result)
    })

    //get all orders of a single user
    app.get('/orders/user/:email', async (req, res) => {
      const email = req.params.email;
      const query = { "customer.email": email }
      const result = await ordersCollection.aggregate([
        {
          $match: query,
        },
        {
          $addFields: {
            plantId: { $toObjectId: '$plantId' }
          },
        },
        {
          $lookup: {
            from: 'plants',
            localField: 'plantId',
            foreignField: '_id',
            as: 'plants'
          }
        },
        {
          $unwind: '$plants'
        },
        {
          $addFields: {
            name: '$plants.name',
            image: '$plants.image',
            category: '$plants.category',
          }
        },
        {
          $project: {
            plants: 0,
          }
        }
      ])
        .toArray();
      res.send(result)
    })

    //save a plant data in DB-----
    app.post('/plants', verifyToken, async (req, res) => {
      const plant = req.body;
      const result = await plantsCollection.insertOne(plant);
      res.send(result)
    })

    //save a order data in DB-----
    app.post('/orders', verifyToken, async (req, res) => {
      const orderInfo = req.body;
      const result = await ordersCollection.insertOne(orderInfo);
      res.send(result)
    })

    //cancel or delete order
    app.delete('/orders/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const order = await ordersCollection.findOne(query);
      if (order.status === 'delivered') {
        return res.status(409).send('You cannot cancel an order after delivering')
      }
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
    })

    //manage plant quantity
    app.patch('/orders/quantity/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const { quantityToUpdate, status } = req.body;
      const filter = { _id: new ObjectId(id) };

      let updateDoc = {
        $inc: { quantity: - quantityToUpdate }
      }

      if (status === 'increase') {
        updateDoc = {
          $inc: { quantity: quantityToUpdate }
        }
      }

      const result = await plantsCollection.updateOne(filter, updateDoc);
      res.send(result)
    })

    //manage user status
    app.patch('/users/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query)
      if (!user || user?.status === 'requested') {
        return res.status(400).send('You have already requested')
      }
      const updateDoc = {
        $set: {
          status: 'requested'
        }
      }
      const result = await usersCollection.updateOne(query, updateDoc);
      res.send(result);
    })

    //save or update user in DB-----
    app.post('/users/:email', async (req, res) => {
      const email = req.params.email;
      const userInfo = req.body;
      const user = { ...userInfo, role: 'customer', timestamp: Date.now() }
      const query = { email };
      const isExists = await usersCollection.findOne(query);

      if (isExists) {
        return res.send(isExists)
      }

      const result = await usersCollection.insertOne(user);
      res.send(result)
    })


    // Generate jwt token
    app.post('/jwt', async (req, res) => {
      const email = req.body
      const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d',
      })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true })
    })
    // Logout
    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true })
      } catch (err) {
        res.status(500).send(err)
      }
    })

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello from plantNet Server..')
})

app.listen(port, () => {
  console.log(`plantNet is running on port ${port}`)
})
