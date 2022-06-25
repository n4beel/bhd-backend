import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jConfig } from './neo4j/neo4j-config.interface';
import { Neo4jModule } from './neo4j/neo4j.module';
import { UserModule } from './user/user.module';
import { OrganizationModule } from './organization/organization.module';
import { ReportProposalModule } from './report-proposal/report-proposal.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Neo4jConfig => ({
        scheme: configService.get('NEO4J_SCHEME'),
        host: configService.get('NEO4J_HOST'),
        username: configService.get('NEO4J_USERNAME'),
        password: configService.get('NEO4J_PASSWORD'),
        database: configService.get('NEO4J_DATABASE'),
        // port: configService.get('NEO4J_PORT'),
      }),
    }),
    UserModule,
    OrganizationModule,
    ReportProposalModule,
    AuthModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
