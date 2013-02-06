class ChangeCommentLength < ActiveRecord::Migration
  def up
      change_column :comments, :name, :string, :null => false, :limit => 15
      change_column :comments, :message, :string, :null => false, :limit => 140
  end

  def down
    change_column :comments, :name, :string
    change_column :comments, :message, :string
  end
end
