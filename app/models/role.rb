class Role < ActiveRecord::Base
  has_many :stakeholders
end
