import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { brotliDecompressSync } from 'zlib';

@Injectable()
export class OrganizationService {
  constructor(private readonly neo4jService: Neo4jService) {}

  ////////////////////////////////////////////////////
  // Add an organization node in the db
  ////////////////////////////////////////////////////
  async createOrganization(body) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
              MATCH (u:User {id: $user})
              CREATE (o:Organization)
              SET o += $properties, o.id = randomUUID()
              CREATE (u)-[:MEMBER]->(o)
              return o
           `,
          {
            user: body.user,
            properties: body.org,
          },
        );
        return res.records.length == 1
          ? { status: 200, result: res.records[0].get('o') }
          : { status: 400, message: 'Unable to add organization' };
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
  // Update an organization in DB
  ////////////////////////////////////////////////////
  async updateOrganization(properties) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
            MATCH (o:Organization {id:$id})
            SET o += $properties
            return o
          `,
          {
            id: properties.id,
            properties,
          },
        );
        return res.records.length == 1
          ? { status: 200, result: res.records[0].get('o') }
          : { status: 400, message: 'Unable to update organization' };
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
  // Delete an organization in DB
  ////////////////////////////////////////////////////
  async deleteOrganization(id) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
            MATCH (o:Organization {id:$id})
            DETACH DELETE o
            RETURN o
          `,
          {
            id,
          },
        );
        return { status: 200, message: 'Organization deleted successfully' };
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
  // Send invite to user
  ////////////////////////////////////////////////////
  async getUserInvites(user) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
            MATCH (u:User {id:$user})
            MATCH (o:Organization)-[:INVITED]->(u)
            RETURN o
          `,
          {
            user,
          },
        );
        return {
          status: 200,
          result:
            res.records.length > 0 ? res.records.map((r) => r.get('o')) : [],
        };
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
  // Send invite to user
  ////////////////////////////////////////////////////
  async sendInvite(body) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
            MATCH (o:Organization {id:$org})
            MATCH (u:User {id:$user})
            CREATE (o)-[:INVITED]->(u)
          `,
          {
            user: body.user,
            org: body.org,
          },
        );
        return { status: 200, message: 'User invited successfully' };
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
  // Accept Org Invite
  ////////////////////////////////////////////////////
  async acceptInvite(body) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
            MATCH (o:Organization {id:$org})
            MATCH (u:User {id:$user})
            MATCH (o)-[i:INVITED]->(u)
            DELETE i
            CREATE (u)-[:MEMBER]->(o)
          `,
          {
            user: body.user,
            org: body.org,
          },
        );
        return { status: 200, message: 'Invite accepted successfully' };
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
  // Reject Org Invite
  ////////////////////////////////////////////////////
  async rejectInvite(body) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
            MATCH (o:Organization {id:$org})
            MATCH (u:User {id:$user})
            MATCH (o)-[i:INVITED]->(u)
            DELETE i
          `,
          {
            user: body.user,
            org: body.org,
          },
        );
        return { status: 200, message: 'Invite rejected successfully' };
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
  // Remove member from organization
  ////////////////////////////////////////////////////
  async removeMember(body) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
            MATCH (o:Organization {id:$org})
            MATCH (u:User {id:$user})
            MATCH (u)-[m:MEMBER]->(o)
            DELETE m
          `,
          {
            user: body.user,
            org: body.org,
          },
        );
        return { status: 200, message: 'User removed successfully' };
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
