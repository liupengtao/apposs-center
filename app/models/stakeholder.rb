class Stakeholder < ActiveRecord::Base
  belongs_to :user
  belongs_to :app
  belongs_to :role
end
