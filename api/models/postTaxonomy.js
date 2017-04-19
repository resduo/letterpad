import { conn } from "../../config/mysql.config";

export const PostTaxonomyModel = conn.define("post_tax_relation", {}, {
    freezeTableName: true // Model tableName will be the same as the model name
});