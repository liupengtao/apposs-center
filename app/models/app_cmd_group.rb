class AppCmdGroup < ActiveRecord::Base
  belongs_to :app
  belongs_to :cmd_group
  
end
