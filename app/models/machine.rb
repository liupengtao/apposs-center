class Machine < ActiveRecord::Base
  belongs_to :room
  belongs_to :app
  
  has_many :operations #, :conditions => ['status <> ?', Operation::COMPLETED]
  has_many :commands, :through => :operations
end
