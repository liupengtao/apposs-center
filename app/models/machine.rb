class Machine < ActiveRecord::Base
  belongs_to :room
  belongs_to :app
end
