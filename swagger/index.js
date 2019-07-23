require('../node_modules/swagger-ui/dist/swagger-ui.css');

import SwaggerUI from 'swagger-ui';
import Spec from './spec.json';

SwaggerUI({
  spec: Spec,
  dom_id: '#app'
});
