import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({
  timestamps: false,
  tableName: 'test',
})
export class Test extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  isPublish!: boolean;
}
