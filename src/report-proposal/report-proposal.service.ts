import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@Injectable()
export class ReportProposalService {
  constructor(private readonly neo4jService: Neo4jService) {}

  ////////////////////////////////////////////////////
  // Paginated API for fetching reports
  ////////////////////////////////////////////////////
  async getReports(page, limit) {
    try {
      try {
        console.log({
          skip: (page - 1) * limit,
          limit,
        });
        const res = await this.neo4jService.read(
          `
          Match (r:Report)
          WHERE r.created_at > 0
          Return r
          ORDER BY r.created_at DESC
          Skip $skip LIMIT $limit
         `,
          {
            skip: this.neo4jService.int((page - 1) * limit),
            limit: this.neo4jService.int(limit),
          },
        );
        return res.records.length > 0 ? res.records.map((a) => a.get('r')) : [];
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
  // Create report node in the db
  ////////////////////////////////////////////////////
  async createReport(body) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
            MATCH (u:User {id:$user})
            CREATE (r:Report)
            SET r += $properties, r.id = randomUUID(), r.created_at = timestamp()
            CREATE (u)-[:REPORTED]->(r)
            return r
         `,
          {
            user: body.user,
            properties: body.report,
          },
        );
        return res.records.length == 1 ? res.records[0].get('r') : undefined;
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
  // Update report data in DB
  ////////////////////////////////////////////////////
  async updateReport(properties) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
          MATCH (r:Report {id:$id})
          SET r += $properties
          return r
        `,
          {
            id: properties.id,
            properties,
          },
        );
        return res.records.length == 1 ? res.records[0].get('r') : undefined;
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
  // Delete report data in DB
  ////////////////////////////////////////////////////
  async deleteReport(id) {
    try {
      try {
        const res = await this.neo4jService.write(
          `
          MATCH (r:Report {id:$id})
          DETACH DELETE r
          RETURN r
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
