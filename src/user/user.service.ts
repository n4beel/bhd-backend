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
        return res.records.length == 1
          ? { status: 200, result: res.records[0].get('u') }
          : { status: 404, message: 'User not found' };
      } catch (error) {
        throw { status: 400, message: error.message };
      }
    } catch (error) {
      console.log(error);
      throw { status: 400, message: error.message };
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
        return res.records.length == 1
          ? { status: 200, result: res.records[0].get('u') }
          : { status: 400, message: 'Unable to create user' };
      } catch (error) {
        console.log('in', error);
        throw { status: 400, message: error.message };
      }
    } catch (error) {
      console.log('out', error);
      throw { status: 400, message: error.message };
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
        return res.records.length == 1
          ? { status: 200, result: res.records[0].get('u') }
          : { status: 400, message: 'Unable to update user' };
      } catch (error) {
        console.log('in', error);
        throw { status: 400, message: error.message };
      }
    } catch (error) {
      console.log('out', error);
      throw { status: 400, message: error.message };
    }
  }
}
