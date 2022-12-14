import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Zahid Flour Mills')
    .setDescription('Zahid Flour Mills API DOC')
    .setVersion('1.0')
    .addTag('ZahidFlourMills')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document, {
    customSiteTitle: 'Zahid Flour Mills API DOC',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(10001);
  console.log('Server is running on http://localhost:10001/api/doc');
}
bootstrap();
// AppClusterService.Clusterize(bootstrap);
