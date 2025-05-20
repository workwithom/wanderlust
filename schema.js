const Joi = require('joi');

module.exports.listingSchema = Joi.object({    listing: Joi.object({
        title: Joi.string().min(3).max(100).required(),
        description: Joi.string().max(500).required(),        price: Joi.number().min(0).required(),
        country: Joi.string().required(),
        image: Joi.string().allow("",null),
        location: Joi.string().required(),
        category: Joi.string().valid(
            'rooms', 'beach', 'mountain', 'village', 'city', 'camping',
            'arctic', 'desert', 'countryside', 'lakefront', 'amazing-pools',
            'camper-vans', 'castles', 'containers', 'design', 'earth-homes',
            'farms', 'national-parks', 'vineyards', 'omg', 'tiny-homes',
            'towers', 'windmills', 'luxe'
        ).required()
    }).required(),
    });

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().max(500).required(),
        username: Joi.string().min(3).max(30),
        rating: Joi.number().min(1).max(5).required()
    }).required()
}); 