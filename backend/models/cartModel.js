const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        default: 1
      },
    }
  ],
  totalPrice: {
        type: Number,
        default: 0
    } 
}, { timestamps: true });

CartSchema.pre('save', async function() {
    await this.populate('items.product');
    let total = 0;
    this.items.forEach(item => {
        if(item.product) {
            total += item.quantity * item.product.price;
        }
    });

    this.totalPrice = total;
    
});
module.exports = mongoose.model('Cart', CartSchema);