import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Neo4jTypeInterceptor } from './neo4j/neo4j-type.interceptor';
import { Neo4jErrorFilter } from './neo4j/neo4j-error.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new Neo4jTypeInterceptor());
  app.useGlobalFilters(new Neo4jErrorFilter());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Block Hacker DAO')
    .setDescription('The Block Hacker DAO API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
