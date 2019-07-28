require('../node_modules/swagger-ui/dist/swagger-ui.css');

import SwaggerUI from 'swagger-ui';
import Spec from './bundle.spec.json';

SwaggerUI({
  spec: Spec,
  dom_id: '#app',
});
