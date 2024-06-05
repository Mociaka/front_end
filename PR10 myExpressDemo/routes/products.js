const express = require("express");
const Joi = require('joi');
const Router = express.Router();

const products = [
    {id: 1, title: "title1", full_text : "text abuot title1"},
    {id: 2, title: "title1", full_text : "text abuot title1"},
    {id: 3, title: "title1", full_text : "text abuot title1"},
    {id: 4, title: "title1", full_text : "text abuot title1"},
    {id: 5, title: "title1", full_text : "text abuot title1"}
];

const productSchema = Joi.object({
    title: Joi.string()
    //.alphanum()
    .min(1)
    .required(),

    full_text: Joi.string()
    //.alphanum()
    .min(1)
    .required()

});

function getMax(productsArray){
    let Ids = productsArray.map(item => item.id);
    return Ids.reduce((max,current) => Math.max(max, current), Ids[0]);
}

Router.route("/")
      .get((request, response) => {
            response.send(products);
      })
      .post((req, res) =>{
        const validationResult = productSchema.validate(req.body);
    
        //validation
        if(validationResult.error){
            console.log(validationResult.error.message);
    
            res.status(400).send(validationResult.error.message);
            return;
        }
    
        const id = getMax(products)+1;
    
        const product = {
            id: id,
            title: req.body.title,
            full_text: req.body.full_text
        };
    
        products.push(product);
    
        res.send(product);
    });

Router.route("/:id")
    .get((request, response) => {
        const product = products.find(item => item.id == request.params.id);
    
        if(!product) {
        response.status(404).send(`Product with id: ${request.params.id} not found`);
        return;
        }

        response.send(product);
    })
    .put((req,res) => {
        const product = products.find(item => item.id == req.params.id);
        
        if(!product) {
           res.status(404).send(`Product with id: ${req.params.id} not found`);
           return;
        }
    
        const validationResult = productSchema.validate(req.body);
    
        // //validation
        if(validationResult.error){
            console.log(validationResult.error.message);
    
            res.status(400).send(validationResult.error.message);
            return;
        }
    
        product.title = req.body.title;
        product.full_text = req.body.full_text;
        res.send(product);
    })
    .delete((req, res) => {
        const product = products.find(item => item.id == req.params.id);
        
        if(!product) {
           res.status(404).send(`Product with id: ${req.params.id} not found`);
           return;
        }
    
        const indexOfProduct = products.indexOf(product);
        products.splice(indexOfProduct, 1);
    
        res.status(200).send(product);
    });


module.exports = Router;