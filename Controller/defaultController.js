var express = require('express')
var router = express.Router()

let grpc = require('grpc')
let protoLoader = require('@grpc/proto-loader')

//Load the protobuf
var proto = grpc.loadPackageDefinition(
    protoLoader.loadSync('client.proto', {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
)

const REMOTE_SERVER = '0.0.0.0:33001'

//Create gRPC client
let client = new proto.calculatorPackage.SumService(
    REMOTE_SERVER,
    grpc.credentials.createInsecure()
);

var routes = function () {
    router.route('/')
    .get(async (req, res) => {
        client.sumTotal(
            {
                paramsa: 1,
                paramsb: 2
            },
            (err, data) => {
            if (!err && data) {
                return res.status(200).json({
                    data: data,
                    statusCode: 200,
                    message: 'Succeed'
                });
            } else {
                return res.status(200).json({
                    data: err,
                    statusCode: 100,
                    message: 'Error'
                });
            }
        })
    });

    return router;
};
module.exports = routes;