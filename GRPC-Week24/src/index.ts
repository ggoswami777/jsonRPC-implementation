import path from 'path';
import * as grpc from '@grpc/grpc-js';
import type { ServiceClientConstructor } from "@grpc/grpc-js"
import * as protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync(path.join(__dirname, './a.proto'));

const personProto = grpc.loadPackageDefinition(packageDefinition);

const PERSONS: any[] = [];

function addPerson(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  console.log(call)
    let person = {
      name: call.request.name,
      age: call.request.age
    }
    PERSONS.push(person);
    callback(null, person)
}

// @ts-ignore
function getPersonByName(call,callback){
    const name=call.request.name;
    const person=PERSONS.find(x=>x.name===name);
    callback(null,person)
}

const server = new grpc.Server();

server.addService((personProto.AddressBookService as ServiceClientConstructor).service, { 
    addPerson: addPerson ,
    getPersonByName:getPersonByName
});
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});