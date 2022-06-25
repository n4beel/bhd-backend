import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@Injectable()
export class UserService {
  constructor(private readonly neo4jService: Neo4jService) {}

  ////////////////////////////////////////////////////
  // Check if user's first connection
  ////////////////////////////////////////////////////
  async isInitial(address) {
    try {
      try {
        const res = await this.neo4jService.read(
          `
          MATCH (u:User {address:$address})
          RETURN u
        `,
          {
            address,
          },
        );
        return res.records.length == 1 ? res.records[0].get('u') : undefined;
      } catch (error) {
        throw [404, error.message];
      }
    } catch (error) {
      console.log(error);
      throw [404, error.message];
    }
  }

  ////////////////////////////////////////////////////
  // Create user's node in DB
  ////////////////////////////////////////////////////
  async createUser(properties) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
          CREATE (u:User)
          SET u += $properties, u.id = randomUUID()
          return u
        `,
          {
            properties,
          },
        );
        return res.records.length == 1 ? res.records[0].get('u') : undefined;
      } catch (error) {
        console.log('in', error);
        throw [404, error.message];
      }
    } catch (error) {
      console.log('out', error);
      throw [404, error.message];
    }
  }

  ////////////////////////////////////////////////////
  // Update user's data in DB
  ////////////////////////////////////////////////////
  async updateUser(properties) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
          MATCH (u:User {id:$id})
          SET u += $properties
          return u
        `,
          {
            id: properties.id,
            properties,
          },
        );
        return res.records.length == 1 ? res.records[0].get('u') : undefined;
      } catch (error) {
        console.log('in', error);
        throw [404, error.message];
      }
    } catch (error) {
      console.log('out', error);
      throw [404, error.message];
    }
  }
}
