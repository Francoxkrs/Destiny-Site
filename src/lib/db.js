// Conexão com o MongoDB do bot, reaproveitada entre pedidos da mesma função.
import { MongoClient } from 'mongodb';
import { env, bancoPronto } from './env.js';

let cliente = globalThis.__bdMongo ?? null;

export async function banco() {
  if (!bancoPronto()) return null;
  if (!cliente) {
    cliente = new MongoClient(env.mongoUri, { maxPoolSize: 5, serverSelectionTimeoutMS: 8000, appName: 'black-destiny-site' });
    globalThis.__bdMongo = cliente;
  }
  await cliente.connect();
  return cliente.db(env.dbName);
}
