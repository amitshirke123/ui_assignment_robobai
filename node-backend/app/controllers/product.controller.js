const db = require("../models");
const Product = db.products;

// Create and Save a new Product
exports.create = (req, res) => {
      // Validate request
  if (!req.body.product_name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Product
  const product = new Product({
    product_name: req.body.product_name,
    cost_price: req.body.cost_price,
    selling_price: req.body.selling_price,
    units_available: req.body.units_available
  });

  // Save Product in the database
  product
    .save(product)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Product."
      });
    });
};

// Retrieve all Products from the database.
exports.findAll = (req, res) => {
    const product_name = req.query.product_name;
  var condition = product_name ? { product_name: { $regex: new RegExp(product_name), $options: "i" } } : {};

  Product.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products."
      });
    });
};

// Find a single Product with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Product.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Product with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Product with id=" + id });
      });
};

// Update a Product by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
    
      const id = req.params.id;
      const product_name = req.body.product_name;
      const selling_price = req.body.selling_price;
    

      Product.update({_id:id}, {$set: {product_name: product_name, selling_price: selling_price}}, function(err, doc){
          if(err){
            res.status(404).send({
                message: `Cannot update Product with id=${id}. Maybe Product was not found!`
              });
          }else{
            res.send({ message: "Product was updated successfully." });
          }
      }).catch(err => {
        res.status(500).send({
          message: "Error updating Product with id=" + id
        });
      });


    //   Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    //     .then(data => {
    //       if (!data) {
    //         res.status(404).send({
    //           message: `Cannot update Product with id=${id}. Maybe Product was not found!`
    //         });
    //       } else res.send({ message: "Product was updated successfully." });
    //     })
    //     .catch(err => {
    //       res.status(500).send({
    //         message: "Error updating Product with id=" + id
    //       });
    //     });
};

// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

  Product.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
        });
      } else {
        res.send({
          message: "Product was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Product with id=" + id
      });
    });
};

// Delete all Products from the database.
exports.deleteAll = (req, res) => {
    Product.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Products were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all products."
      });
    });
};

