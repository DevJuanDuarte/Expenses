import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('float', { default: 0 })
  price: number;

  @Column('text')
  description: string;

  @Column('int', { default: 0 })
  quantity: number;

  @Column({ type: 'timestamp', default: () => `CURRENT_TIMESTAMP` })
  created: Date;

  @Column('text', { array: true, default: [] })
  tags: string[];



  //Si un parametro no se pasa se puede reemplazar por otro parametro para no generar error si el campo es requerido
  @BeforeInsert()
  checkDescriptionInsert() {
    if (!this.description) {
      this.description = this.title
    }
    this.description = this.description.toLowerCase().replaceAll(' ', '_').replaceAll("'", '_')
  }

  @BeforeUpdate()
  checkDescriptionUpdate() {
    this.description = this.description.toLowerCase().replaceAll(' ', '_').replaceAll("'", '_')
  }

}
