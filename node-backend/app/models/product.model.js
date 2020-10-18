module.exports = mongoose => {

    var schema = mongoose.Schema(
        {
          product_name: String,
          cost_price: Number,
          selling_price: Number,
          units_available: Number
        },
        { timestamps: true }
      );
    
      schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });

    const Product = mongoose.model('product',schema);
  
    return Product;
  };