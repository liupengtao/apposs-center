class App < ActiveRecord::Base
  # People
  has_many :stakeholders
  has_many :operators, :through => :stakeholders, :class_name => 'User'
  
  # Machine
  has_many :machines

  has_many :cmd_set_defs
  
  has_many :cmd_sets
  
  def to_s
  	send :name
  end

end
