// @flow
import graphqlContextEntities from "./graphqlContextEntities";
import entities from "./entities";
import graphql from "./graphql";
import security from "./security";

export default [...entities, graphql, graphqlContextEntities, ...security];
