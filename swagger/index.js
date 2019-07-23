require('../node_modules/swagger-ui/dist/swagger-ui.css');

import SwaggerUI from 'swagger-ui';

SwaggerUI({
  url: "https://petstore.swagger.io/v2/swagger.json",
  dom_id: '#app'
});
