class Comment < ActiveRecord::Base
  validates_presence_of :name, :message
  validates_length_of :name, :maximum => 15
  validates_length_of :message, :maximum => 140
end
