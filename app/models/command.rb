class Command < ActiveRecord::Base
  belongs_to :operator, :class_name => 'User'
  belongs_to :app
  has_many :options
  has_many :operations
  has_many :related_machines, :through => :operations, :class_name => 'Machine'
end
