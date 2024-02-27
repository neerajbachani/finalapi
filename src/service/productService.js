const Product = require("../models/productModel")

async function createProduct(reqData) {
   
    const detailsAsBulletPoints = reqData.details.split('. ').map(detail => `<li>${detail}</li>`).join('');

    const product = new Product({
        name: reqData.name,
        description1: reqData.description1,
        description2: reqData.description2,
        description3: reqData.description3,
        price: reqData.price,
        discountedPrice: reqData.discountedPrice,
        image: reqData.image,
        quantity: reqData.quantity,
        color: reqData.color,
        resin: reqData.resin,
        digitalArt: reqData.digitalArt,
        festivalSpecial: reqData.festivalSpecial,
        jewel: reqData.jewel,
        business: reqData.bussiness,
        lippanArt: reqData.lippanArt,
        vintage: reqData.vintage,
        geodeArt: reqData.geodeArt,
        option: reqData.option,   
        details: `<ul>${detailsAsBulletPoints}</ul>`, 
        discount: reqData.discount,
        

    });

    return await product.save()
    


}

async function deleteProduct(productId) {
    const product = await findProductById(productId);

    await Product.findByIdAndDelete(productId);

    return "Product deleted successfully";
}

async function updateProduct(productId, reqData) {
    return await Product.findByIdAndUpdate(productId, reqData);
}

async function findProductById(id) {
    const product = await Product.findById(id).exec();
  
    if (!product) {
      throw new Error("Product not found with id " + id);
    }
  
    return product;
}

async function getAllProducts(reqQuery) {
    let { color, resin, digitalArt, jewel, sizes, minPrice, maxPrice, minDiscount, sort, stock, pageNumber, pageSize } = reqQuery;

    pageSize = pageSize || 10;
    let query = Product.find();

    
    if (color) {
        const colorSet = new Set(color.split(",").map(color => color.trim().toLowerCase()));
    
        const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
    
        query = query.where("color").regex(colorRegex);
    }
    if (resin) {
        const resinSet = new Set(resin.split(",").map(resin => resin.trim().toLowerCase()));
    
        const resinRegex = resinSet.size > 0 ? new RegExp([...resinSet].join("|"), "i") : null;
    
        query = query.where("resin").regex(resinRegex);
    }
    if (digitalArt) {
        const digitalArtSet = new Set(digitalArt.split(",").map(digitalArt => digitalArt.trim().toLowerCase()));
    
        const digitalArtRegex = digitalArtSet.size > 0 ? new RegExp([...digitalArtSet].join("|"), "i") : null;
    
        query = query.where("digitalArt").regex(digitalArtRegex);
    }
    if (jewel) {
        const jewelSet = new Set(jewel.split(",").map(jewel => jewel.trim().toLowerCase()));
    
        const jewelRegex = jewelSet.size > 0 ? new RegExp([...jewelSet].join("|"), "i") : null;
    
        query = query.where("jewel").regex(jewelRegex);
    }
    
    if (sizes) {
        const sizesSet = new Set(sizes);
        query.query.where("sizes.name").in([...sizesSet]);
    }
    
    if (minPrice && maxPrice) {
        query = query.where('discountedPrice').gte(minPrice).lte(maxPrice);
    }

    if(minDiscount){
        query = (await query.where("discount")).gte(minDiscount)
    }

    if (stock) {
        if (stock == "in_stock") {
            query = query.where("quantity").gt(0);
        } 
        else if (stock == "out_of_stock") {
            query = query.where("quantity").gt(1);
        }
    }
    if (sort) {
        const sortDirection = sort === "price_hight" ? -1 : 1;
        query = query.sort({ discountedPrice: sortDirection });
    }
    
    const totalProducts = await Product.countDocuments(query);
    
    const skip = (pageNumber - 1) * pageSize;

    query = query.skip(skip).limit(pageSize)

    const products = await query.exec()

    const totalPages = Math.ceil(totalProducts/pageSize)

    return {content: products, currentPage: pageNumber, totalPages}
    
    
}

async function createMultipleProducts(products){
    for(let product of products){
        await createProduct(product)
    }
}

module.exports = { createProduct, deleteProduct, updateProduct, findProductById, getAllProducts, createMultipleProducts }

  
