import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface CommentAttributes {
  id: number;
  article_id: number;
  user_id: number;
  content: string;
  reply?: number;
  client_ip?: string;
  time: Date;
}

export type CommentPk = "id";
export type CommentId = Comment[CommentPk];
export type CommentOptionalAttributes = "reply" | "client_ip";
export type CommentCreationAttributes = Optional<CommentAttributes, CommentOptionalAttributes>;

export class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  id!: number;
  article_id!: number;
  user_id!: number;
  content!: string;
  reply?: number;
  client_ip?: string;
  time!: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof Comment {
    return sequelize.define('Comment', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "ID"
    },
    article_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "文章ID"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "用户ID"
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "内容"
    },
    reply: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "是否是对某个评论的回复，不是则为null是则为对应的评论id"
    },
    client_ip: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "用户IP"
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "评论时间"
    }
  }, {
    tableName: 'comment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  }) as typeof Comment;
  }
}
