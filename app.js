const User = require('./models/user');
const Product = require('./models/product');
const Order = require('./models/order');
const Cart = require('./models/cart');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local');
const isASeller = require('./isASeller');
const methodOverride = require('method-override');
const express  = require('express');
const app = express();
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/multiSellerDb').then(() => {
    console.log("Mongoose Server Started!");
}).catch((err) => {
    console.log("Err mongoose!");
});
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:'notagoodsecret',
    resave:false,
    saveUninitialized:false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res,next)=>{
    res.locals.currentUser = req.user;
    next();
});


app.get(['/','/home'], (req, res)=>{
    res.render('home');
});
app.get('/products', async(req, res)=>{
    const products = await Product.find({}).populate('owner');
    res.render('products', {products});
});
app.get('/products/product/:id', async(req, res)=>{
const product =await Product.findById(req.params.id);
res.render('productLandingPage',{product});
});


app.get('/login', (req, res)=>{
    res.render('login');
});
app.post('/login', passport.authenticate('local', {
    successRedirect: '/sellerPanel', // Redirect after successful login
    failureRedirect: '/login', // Redirect on failure
}));

app.get('/start_selling', (req, res)=>{
    res.render('register');
});
app.post('/registerAsSeller', async(req, res) => {
    const {name, email, password, username, storeName } = req.body;
    const newSeller = new User({ name: name, email: email, username: username, role: 'seller', storeName: storeName });
    await User.register(newSeller, password);
    newSeller.save();
    console.log('Seller registered correctly');

    req.login(newSeller, (err) => {
        if (err) {
            console.log('Error logging in');
            return res.redirect('/login');
        }
        return res.redirect('/sellerPanel');
    });
});
app.post('/cart/add', isASeller, async (req, res) => {
    try {
        const userId = req.user._id;
        const { product_id } = req.body;
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [product_id],
            });
            await cart.save();
            return res.json({ success: true, message: "New cart created and product added" });
        }

        if (!cart.items.includes(product_id)) {
            cart.items.push(product_id);
            await cart.save();
            return res.json({ success: true, message: "Product added to cart!" });
        }

        return res.json({ success: false, message: "Product already in cart" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
app.delete('/cart/item', isASeller, async (req, res) => {
    try {
        const { product_id } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.json({ success: false, message: "Cart not found" });
        }


        // Remove the product from the cart's items array
        cart.items = cart.items.filter(item => item.toString() !== product_id);

        await cart.save();

        return res.json({ success: true, message: "Product removed from cart" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


app.delete('/cart', isASeller, async(req, res)=>{
    try {
        await Cart.findOneAndDelete({user:req.user._id});
        res.send('successfullt delete the cart');
    } catch (error) {
        console.log(error);
    }
})

app.get('/cart',isASeller, async(req, res)=>{
    try{
        const cart  = await Cart.findOne({user: req.user._id}).populate('items');
        console.log(cart);
        res.render('cart', {cart});
    }
    catch(err)
    {
        next(err);
    } 
});
app.post('/add-product',isASeller, async(req, res)=>{
    const { name, frameType, weight, handleSize, maxTension, price } = req.body;
    const newProduct = new Product({name: name,price:price,frameType : frameType, weight: weight, handleSize: handleSize, maxTension: maxTension, owner: req.user._id});
    await newProduct.save();
    await User.findByIdAndUpdate(req.user._id, {$push:{products:newProduct._id}});
    res.redirect('/sellerPanel');
});
app.delete('/product/:id', async(req, res)=>{
    const {id} = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/sellerPanel/SellerProducts');
})
app.get('/sellerPanel',isASeller,async(req, res)=>{
    console.log(req.user._id);
    const products = await Product.find({owner:req.user._id});
    res.render('sellerPanel', {products});
});
app.get('/sellerPanel/SellerProducts',isASeller, async(req, res)=>{
    const products = await Product.find({owner:req.user._id});
    res.render('sellerProducts', {products});
});
app.get('/sellerPanel/SellerProducts/product/:id/edit',isASeller, async(req, res)=>{
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('sellerPanel/editProductForm', {product});
});
app.put('/sellerPanel/SellerProducts/product/:id',isASeller, async(req, res)=>{
    const { name, frameType, weight, handleSize, maxTension, price } = req.body;
    await Product.findByIdAndUpdate(req.params.id, {
                name,
                frameType,
                weight,
                handleSize,
                maxTension,
                price,
    },{new:true});
    res.redirect('/sellerPanel/SellerProducts');
});

app.use((err, req, res,next )=>{
    console.log(err);
    res.redirect('/home');
})

app.listen('3000', (req, res)=>{
    console.log('ON PORT 3000');
});
