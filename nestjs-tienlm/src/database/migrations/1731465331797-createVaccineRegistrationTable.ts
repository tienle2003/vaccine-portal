import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVaccineRegistrationTable1731465331797 implements MigrationInterface {
    name = 'CreateVaccineRegistrationTable1731465331797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`vaccine_registration\` (\`id\` int NOT NULL AUTO_INCREMENT, \`priorityType\` enum ('1', '2', '3') NOT NULL DEFAULT '1', \`insuaranceNumber\` varchar(15) NULL, \`job\` varchar(255) NULL, \`company\` varchar(255) NULL, \`currentAddress\` varchar(500) NULL, \`preferredDate\` timestamp NULL, \`injectionSession\` enum ('1', '2') NOT NULL DEFAULT '1', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, UNIQUE INDEX \`IDX_266fafb08fd2aa348f52aca6c0\` (\`insuaranceNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`vaccine_registration\` ADD CONSTRAINT \`FK_638ec06d6705017ed410e2ffeea\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vaccine_registration\` DROP FOREIGN KEY \`FK_638ec06d6705017ed410e2ffeea\``);
        await queryRunner.query(`DROP INDEX \`IDX_266fafb08fd2aa348f52aca6c0\` ON \`vaccine_registration\``);
        await queryRunner.query(`DROP TABLE \`vaccine_registration\``);
    }

}
