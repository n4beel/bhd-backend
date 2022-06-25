import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@Injectable()
export class CommentService {
  constructor(private readonly neo4jService: Neo4jService) {}

  ////////////////////////////////////////////////////
  // Fetch comments of a report
  ////////////////////////////////////////////////////
  async getComments(report) {
    try {
      try {
        const res = await this.neo4jService.read(
          `
            Match (c:Comment)
            WHERE c.created_at > 0
            Return c
            ORDER BY c.created_at
           `,
          {
            report,
          },
        );
        return res.records.length > 0 ? res.records.map((a) => a.get('c')) : [];
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
  // Add a comment node in the db
  ////////////////////////////////////////////////////
  async createComment(body) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
              MATCH (u:User {id:$user})
              MATCH (r:Report {id:$report})
              CREATE (c:Comment)
              SET c += $properties, c.id = randomUUID(), c.created_at = timestamp()
              CREATE (u)-[:COMMENTED]->(c), (r)-[:COMMENT]->(c)
              return c
           `,
          {
            user: body.user,
            report: body.report,
            properties: body.comment,
          },
        );
        return res.records.length == 1 ? res.records[0].get('c') : undefined;
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
  // Update comment in DB
  ////////////////////////////////////////////////////
  async updateComment(properties) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
            MATCH (c:Comment {id:$id})
            SET c += $properties
            return c
          `,
          {
            id: properties.id,
            properties,
          },
        );
        return res.records.length == 1 ? res.records[0].get('c') : undefined;
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
  // Delete comment in DB
  ////////////////////////////////////////////////////
  async deleteComment(id) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
            MATCH (c:Comment {id:$id})
            DETACH DELETE c
            RETURN c
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
}
