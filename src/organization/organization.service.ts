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
        return res.records.length == 1 ? res.records[0].get('o') : undefined;
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
        return res.records.length == 1 ? res.records[0].get('o') : undefined;
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
        return 'deleted';
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
        return res.records.length > 0 ? res.records.map((r) => r.get('o')) : [];
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
        return 'invited';
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
        return 'accepted';
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
        return 'rejected';
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
        return 'removed';
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
