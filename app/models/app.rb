class App < ActiveRecord::Base
  has_many :stakeholders
  has_many :operators, :through => :stakeholders, :class_name => 'User'
  has_many :machines
  has_many :commands
end
