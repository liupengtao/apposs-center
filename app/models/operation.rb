class Operation < ActiveRecord::Base
  belongs_to :machine
  belongs_to :command
end
