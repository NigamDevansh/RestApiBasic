const express = require("express")
const mongoose = require("mongoose")
const bodyParser =  require("body-parser")
const app =express()

mongoose.connect("mongodb://127.0.0.1:27017/Samplee",{useNewUrlParser:true,useUnifiedTopology:true}).then(()=> {
    console.log("Conection Success");
}).catch((err)=> {
    console.log(err);
})

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())


const productSchema= new mongoose.Schema( {
    name: String,
    description: String,
    price: Number
})

const product = new mongoose.model("Product", productSchema)


app.post("/api/v1/product/new",async(req,res)=> {

//We are getting the data from the front end of the url so req.body is used and to parse it we use body-parse
    const productCreator = await product.create(req.body);

// This is basically sending the respose back to teh server with status adn whole json object
    res.status(201).json ({
        success:true,
        productCreator
    })
})

app.get('/api/v1/products', async(req,res)=>{
    
    const products = await product.find();

    res.status(200).json({
        success:true,
        products
    })
})

app.put("/api/v1/product/:id", async(req,res)=> {

//In this we use the req.params.id and get the id of the product and then put that id again to update the matter of that id

    let findProd = await product.findById(req.params.id);

    if(!findProd) {
        return res.status(500).json({
            success:false,
            message:"NO such product"
        })
    }


//This is a predefined function runs over mongodb "findByIdAndUpdate"

    findProd = await product.findByIdAndUpdate(req.params.id,req.body, {new:true,
                                                                        useFindAndModify:false,
                                                                        runValidators:true       
        
    })

    res.status(200).json({
        success:true,
        findProd
    })
})



app.delete("/api/v1/product/:id", async(req,res)=> {

    //In this we use the req.params.id and get the id of the product and then put that id again to update the matter of that id
    
        const findProd = await product.findById(req.params.id);


        if(!findProd) {
            return res.status(500).json({
                success:false,
                message:"NO such product"
            })
        }
    
    //this is a method to remove the object from the array
    
        await findProd.remove()
    
        res.status(200).json({
            success:true,
            message: "Product was deleted"
        })
    })



app.listen(4000,()=> {
    console.log("Server is working at http://localhost:4000");
})