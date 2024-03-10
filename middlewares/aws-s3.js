var aws = require('aws-sdk');
var multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
    secretAccessKey: "P0Z84jEVGanry1mD6XzgQkTPVmoJ2biV5WnFTFJS",
    accessKeyId: 'AKIA2JVEV34P34HOHNEF',
    region: 'sa-east-1'
});

var s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'petsworldbucket',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'private',
        metadata: function (req, file, cb) {
            cb(null, {
                fieldName: file.fieldname
            });
        },
        key: function (req, file, cb) {
            cb(null, Date.now() + "/" + file.originalname)

        }
    })
});


exports.uploadAdminFiles = function (req, res, next) {
    //console.log("gggggggggggggg")
    upload.fields([
        {
            name: 'categoryImage',
            maxCount: 10
        }
        , {
            name: 'image',
            maxCount: 10
        }, {
            name: 'MainCategoryImage',
            maxCount: 10
        }

    ])(req, res, function (err, some) {
        if (err) {
            return res.status(422).send({
                message: "image folder missing",
                response: null
            });
        }
        next();
    });
}

exports.uploadFiles = function (req, res, next) {
    upload.fields([{ name: 'images', maxCount: 10 }])
        (req, res, function (err, some) {
        if (err) {
            return res.status(422).send({message: "image folder missing",response: null});
        }
        next();
    });
}


exports.uploadPdf = function (params) {
    s3.upload(params, function (err, response) {
        if (err) {
            console.log(err)
        }

        invoiceUrl = response.Location;
        console.log(invoiceUrl)
        return invoiceUrl;
    });
}
