import Author, { associateAuthor } from "./author";
import Media from "./media";
import Permission, { associatePermission } from "./permission";
import Post, { associatePost } from "./post";
import PostTaxonomy, { associatePostTaxonomy } from "./postTaxonomy";
import Role, { associateRole } from "./role";
import { Sequelize } from "sequelize";
import Setting from "./setting";
import Taxonomy, { associateTaxonomy } from "./taxonomy";
import dbConfig from "../../config/db.config";

enum envs {
  development = "development",
  test = "test",
  production = "production",
}

let env: envs = process.env.NODE_ENV
  ? envs[process.env.NODE_ENV as envs]
  : envs.development;

if (env === envs.development) env = envs.development;
if (env === envs.test) env = envs.test;

const config = dbConfig[env];
console.log("config :>> ", config);
// establish  database connection
export const conn = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    dialect: config.dialect || "sqlite",
  },
);

export const modelsMap = {
  Taxonomy: Taxonomy(conn),
  Setting: Setting(conn),
  PostTaxonomy: PostTaxonomy(conn),
  Media: Media(conn),
  Post: Post(conn),
  Author: Author(conn),
  Role: Role(conn),
  Permission: Permission(conn),
};
const models = { Sequelize: Sequelize, sequelize: conn, ...modelsMap };

associateTaxonomy();
associatePostTaxonomy();
associatePost();
associateAuthor();
associateRole();
associatePermission();

export default models;
