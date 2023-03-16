import { AuthSwaggerSchemas, JenisPerawatanSwaggerSchemas, ResorsSwaggerSchemas, RolesSwaggerSchemas } from '../resources';
import QuerySchema from '../utils/explore/query/query-swagger-schema';

const schemas = Object.assign(
  { ...QuerySchema },
  { ...AuthSwaggerSchemas },
  { ...ResorsSwaggerSchemas },
  { ...RolesSwaggerSchemas },
  { ...JenisPerawatanSwaggerSchemas }
);

export default schemas;
