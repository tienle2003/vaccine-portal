import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVaccinationTable1731313435596 implements MigrationInterface {
  name = 'CreateVaccinationTable1731313435596';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`vaccination_sites\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`detailAddress\` varchar(255) NULL, \`manager\` varchar(255) NOT NULL, \`numberOfTables\` int NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`provinceId\` int NULL, \`districtId\` int NULL, \`wardId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vaccination_sites\` ADD CONSTRAINT \`FK_5fe31ce28b9e7414a03c56beaab\` FOREIGN KEY (\`provinceId\`) REFERENCES \`province\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vaccination_sites\` ADD CONSTRAINT \`FK_34ad965cdf550c586c6420cb048\` FOREIGN KEY (\`districtId\`) REFERENCES \`district\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vaccination_sites\` ADD CONSTRAINT \`FK_e916891dfb58019c07458eb0304\` FOREIGN KEY (\`wardId\`) REFERENCES \`ward\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`vaccination_sites\` DROP FOREIGN KEY \`FK_e916891dfb58019c07458eb0304\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vaccination_sites\` DROP FOREIGN KEY \`FK_34ad965cdf550c586c6420cb048\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vaccination_sites\` DROP FOREIGN KEY \`FK_5fe31ce28b9e7414a03c56beaab\``,
    );
    await queryRunner.query(`DROP TABLE \`vaccination_sites\``);
  }
}
