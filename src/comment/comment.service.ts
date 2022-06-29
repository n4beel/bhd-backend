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
            Match (r:Report {id: $report})
            Match (r)-[:COMMENT]->(c:Comment)
            MATCH (u:User)-[:COMMENTED]->(c)
            WHERE c.created_at > 0
            Return c, u.name as name
            ORDER BY c.created_at
           `,
          {
            report,
          },
        );
        return {
          status: 200,
          result:
            res.records.length > 0
              ? res.records.map((a) => ({
                  ...a.get('c').properties,
                  name: a.get('name'),
                }))
              : [],
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
        return res.records.length == 1
          ? { status: 200, result: res.records[0].get('c') }
          : { status: 400, message: 'Unable to add comment' };
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
        return res.records.length == 1
          ? { status: 200, result: res.records[0].get('c') }
          : { status: 400, message: 'Unable to update comment' };
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
        return { status: 200, message: 'Comment deleted successfully' };
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
